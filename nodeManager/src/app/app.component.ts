import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
import { Transaction } from './model/transaction.model'
import { ServiceNode } from './model/servicenode.model'
import { CurrencyMaskModule } from "ng2-currency-mask";
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  
  constructor(private appService: AppService) { }

  public rows_table:Array<Transaction> = [];
  public rows_pending:Array<Transaction> = [];
  public rows_nodes:Array<Transaction> = [];
  public rows_generate: Array<Transaction> = [];
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

  currencies: Array<string> = [];
  nodes: Array<ServiceNode> = [];
  selectedNode: ServiceNode;
  newTransaction : Transaction = new Transaction();
  message: string = '';

  ngOnInit() {
    this.appService.getNodes().subscribe(response => {
      this.nodes = response;
      this.selectedNode = this.nodes[0];
    });
    this.currencies = this.appService.getCurrencies();
    this.newTransaction.creditType = this.currencies[0];
    this.newTransaction.debitType = this.currencies[0];
    this.onNodeChange(this.selectedNode);
  }

  onNodeChange(newNode) {
    for (var i = 0; i < this.nodes.length; i++) {
      if(this.nodes[i].uniqueID === newNode){
        this.selectedNode = this.nodes[i];
      }
    }
    
    this.appService.getTable(this.selectedNode.url).subscribe (response => {
      this.rows_table = [];
      let data : any = JSON.parse(JSON.stringify(response)).chain;
      let transactions : any = [];
      for (var i = 0; i < data.length; i++){
        if (data[i].creator_id === this.selectedNode.uniqueID)
          transactions.push(...data[i].transactions);
      }
      this.rows_table.push(...transactions);
    });
  }

  updateGeneratedTransactions() {
    this.appService.generateTransactions().subscribe(response => {      
      this.rows_generate = [];
      let transactions : any = JSON.parse(JSON.stringify(response));
      this.rows_generate.push(...transactions);
      console.log(this.rows_generate);
    });
  }

  addGeneratedTransactions() {
    if (this.rows_generate.length > 0) {
      for (var i = 0; i < this.rows_generate.length; i ++){
        this.appService.addTransaction(this.selectedNode.url, this.rows_generate[i]).subscribe(response => {
          if (i == this.rows_generate.length) {
            this.rows_generate = [];
            $('#generateModal').modal('hide');
            this.message = i + " transactions were added to pending transactions";
            $('#dialog').modal('show');
          }
        });
      }
    }
  }

  onNewTransaction() {
    this.appService.addTransaction(this.selectedNode.url, this.newTransaction).subscribe (response => {
      $('#transactionModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
    });
    this.newTransaction = new Transaction();
    this.newTransaction.creditType = this.currencies[0];
    this.newTransaction.debitType = this.currencies[0];
  }

  updatePendingTransactions() {
    this.appService.getPendingTransactions(this.selectedNode.url).subscribe (response => {
      this.rows_pending = [];
      let transactions : any = JSON.parse(JSON.stringify(response)).transactions;
      this.rows_pending.push(...transactions);
    });    
  }

  mineBlock() {
    this.appService.mineBlock(this.selectedNode.url).subscribe (response => {
      $('#mineBlockModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
      this.onNodeChange(this.selectedNode);
    });
  }

  updateNodes() {
    this.appService.getPeers(this.selectedNode.url).subscribe (response => {
      this.rows_nodes = [];
      let peers : any = JSON.parse(JSON.stringify(response)).peers;
      this.rows_nodes.push(...peers);
    });    
  }

  handleNode() {
    this.appService.handleNode(this.selectedNode.url).subscribe (response => {
      $('#syncModal').modal('hide');
      this.message = JSON.parse(JSON.stringify(response)).message;
      $('#dialog').modal('show');
      this.onNodeChange(this.selectedNode);
    });
  }
}
