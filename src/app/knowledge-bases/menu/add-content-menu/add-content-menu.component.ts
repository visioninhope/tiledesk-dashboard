import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'add-content-menu',
  templateUrl: './add-content-menu.component.html',
  styleUrls: ['./add-content-menu.component.scss']
})
export class AddContentMenuComponent implements OnInit {
  @Output() openAddKnowledgeBaseModal = new EventEmitter();



  items = [];//[{"label": "Single URL", "type":"url-page"},{"label": "URL(s)", "type":"urls"}, {"label": "Plain Text", "type":"text-file"}];
  menuTitle: string = "";

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {

    // this.translate.get('KbPage.AddKbURL')
    // .subscribe((text: any) => {
    //     let item = {"label": text, "type":"url-page"};
    //     this.items.push(item);
    // });

    this.translate.get('KbPage.AddKbURLs')
    .subscribe((text: any) => {
        let item = {"label": 'Add URL(s)', "type":"urls"};
        this.items.push(item);
    });

    this.translate.get('KbPage.AddKbText')
    .subscribe((text: any) => {
        let item = {"label": text, "type":"text-file"};
        this.items.push(item);
    });

    //this.items = [{"label": "Single URL", "type":"url-page"},{"label": "URL(s)", "type":"urls"}, {"label": "Plain Text", "type":"text-file"}];


  }

  onOpenAddKnowledgeBaseModal(event){
    // console.log('onOpenAddKnowledgeBaseModal:', event);
    this.openAddKnowledgeBaseModal.emit(event);
  }
}