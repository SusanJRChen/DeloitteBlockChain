import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
import { Transaction } from './model/transaction.model'
import { CurrencyMaskModule } from "ng2-currency-mask";
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  
  constructor(private appService: AppService) { }
  public rows:Array<any> = [];
  public rows_pending:Array<any> = [];
  public rows_nodes:Array<any> = [];
  public columns:Array<any> = [
    {title: 'ID', name: 'id'},
    {title: 'Date', name: 'date'},
    {title: 'Description', name: 'description'},
    {title: 'Debit', name: 'debit'},
    {title: 'Credit', name: 'credit'}
  ]

  public config:any = {
    paging: false,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered']
  };
  currencies = [];
  nodes = [];
  selectedNode: string;
  newTransaction : Transaction = new Transaction();
  message: string = '';

  ngOnInit() {
    this.nodes = this.appService.getNodes();
    this.currencies = this.appService.getCurrencies();
    this.newTransaction.creditType = this.currencies[0];
    this.newTransaction.debitType = this.currencies[0];
    this.selectedNode = this.nodes[0];
    this.onNodeChange(this.selectedNode);
  }

  onNodeChange(newNode) {
    this.selectedNode = newNode;
    this.appService.getTable(this.selectedNode).subscribe (response => {
      this.rows = [];
      let data : any = JSON.parse(JSON.stringify(response)).chain;
      let transactions : any = [];
      for (var i = 0; i < data.length; i++){
        transactions.push(...data[i].transactions);
      }
      this.rows.push(...transactions);
    });
  }

  onNewTransaction() {
    this.appService.addTransaction(this.selectedNode, this.newTransaction).subscribe (response => {
      $('#transactionModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
    });
    this.newTransaction = new Transaction();
  }

  updatePendingTransactions() {
    this.appService.getPendingTransactions(this.selectedNode).subscribe (response => {
      this.rows_pending = [];
      let transactions : any = JSON.parse(JSON.stringify(response)).transactions;
      this.rows_pending.push(...transactions);
    });    
  }

  mineBlock() {
    this.appService.mineBlock(this.selectedNode).subscribe (response => {
      $('#mineBlockModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
      this.onNodeChange(this.selectedNode);
    });
  }

  updateNodes() {
    this.appService.getPeers(this.selectedNode).subscribe (response => {
      this.rows_nodes = [];
      let peers : any = JSON.parse(JSON.stringify(response)).peers;
      this.rows_nodes.push(...peers);
    });    
  }

  handleNode() {
    this.appService.handleNode(this.selectedNode).subscribe (response => {
      $('#syncModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
      this.onNodeChange(this.selectedNode);
    });
  }
}
