import { Injectable } from '@angular/core';
import { TiledeskConnectors } from 'app/../assets/cds/js/tiledesk-connectors.js';
import { StageService } from 'app/chatbot-design-studio/services/stage.service';
import { TYPE_ACTION, TYPE_BUTTON } from 'app/chatbot-design-studio/utils';
import { Intent } from 'app/models/intent-model';
/** CLASSE DI SERVICES PER GESTIRE I CONNETTORI **/


@Injectable({
  providedIn: 'root'
})

export class ConnectorService {
  listOfConnectors: any = {};
  tiledeskConnectors: any;

  constructor(
    private stageService: StageService
  ) {}

  initializeConnectors(){
    this.tiledeskConnectors = new TiledeskConnectors("tds_drawer", {"input_block": "tds_input_block"}, []);
    this.tiledeskConnectors.mousedown(document);
  }

  /**  create Connectors */
  createConnectors(intents){
    console.log('-----> createConnectors::: ', intents);
    intents.forEach(intent => {
      if(intent.actions){
        intent.actions.forEach(action => {

          /**  INTENT */
          if(action._tdActionType === TYPE_ACTION.INTENT){
            if(action.intentName && action.intentName !== ''){
              const idConnectorFrom = intent.intent_id+'/'+action._tdActionId;
              const idConnectorTo = action.intentName;
              console.log('idConnectorFrom', idConnectorFrom);
              console.log('idConnectorTo', idConnectorTo);
              this.tiledeskConnectors.createConnectorFromId(idConnectorFrom, idConnectorTo);
            }
          }

          /**  REPLY  RANDOM_REPLY */
          if(action._tdActionType === TYPE_ACTION.REPLY || action._tdActionType === TYPE_ACTION.RANDOM_REPLY){
            
            var buttons = this.findButtons(action);
            // console.log('buttons   ----- >', buttons);
            buttons.forEach(button => {
              console.log('button   ----- > ', button);
              if(button.type === TYPE_BUTTON.ACTION && button.action){
                const idConnectorFrom = button.idConnector;
                var startIndex = button.action.indexOf('#') + 1;
                var endIndex = button.action.indexOf('{');
                let idConnectorTo = button.action.substring(startIndex);
                if(endIndex>-1){
                  idConnectorTo = button.action.substring(startIndex, endIndex);
                }
                console.log('idConnectorFrom', idConnectorFrom);
                console.log('idConnectorTo', idConnectorTo);
                if(idConnectorFrom && idConnectorTo){
                  this.tiledeskConnectors.createConnectorFromId(idConnectorFrom, idConnectorTo);
                }
              }
            });
          }
          if(action._tdActionType === TYPE_ACTION.ONLINE_AGENTS){
            if(action.trueIntent && action.trueIntent !== ''){
              const idConnectorFrom = intent.intent_id+'/'+action._tdActionId + '/true';
              const idConnectorTo = action.trueIntent;
              console.log('idConnectorFrom', idConnectorFrom);
              console.log('idConnectorTo', idConnectorTo);
              this.tiledeskConnectors.createConnectorFromId(idConnectorFrom, idConnectorTo);
            }
            if(action.falseIntent && action.falseIntent !== ''){
              const idConnectorFrom = intent.intent_id+'/'+action._tdActionId + '/false';
              const idConnectorTo = action.falseIntent;
              console.log('idConnectorFrom', idConnectorFrom);
              console.log('idConnectorTo', idConnectorTo);
              this.tiledeskConnectors.createConnectorFromId(idConnectorFrom, idConnectorTo);
            }
          }

        });
      }
    });
  }


  private findButtons(obj) {
    var buttons = [];
    if(!obj) return buttons;
    // Verifica se l'oggetto corrente è un array
    if (Array.isArray(obj)) {
      // Itera sugli elementi dell'array
      for (var i = 0; i < obj.length; i++) {
        // Richiama la funzione findButtons in modo ricorsivo per ogni elemento
        buttons = buttons.concat(this.findButtons(obj[i]));
      }
    } else if (typeof obj === 'object') {
      // Verifica se l'oggetto corrente ha una proprietà "buttons"
      if (obj.hasOwnProperty('buttons')) {
        // Aggiungi l'array di pulsanti alla lista dei pulsanti trovati
        obj.buttons.forEach(button => {
          buttons.push(button);
        });
      }
      // Itera sulle proprietà dell'oggetto
      for (var key in obj) {
        // Richiama la funzione findButtons in modo ricorsivo per ogni proprietà
        buttons = buttons.concat(this.findButtons(obj[key]));
      }
    }
    return buttons;
  }

  /** */
  createNewConnector(fromId:string, toId:string){
    console.log('createNewConnector:: fromId:', fromId, 'toId:', toId);
    const elFrom = document.getElementById(fromId);
    const elTo = document.getElementById(toId);
    console.log('createNewConnector:: ', elFrom, elTo);
    if (elFrom && elTo) { 
      const fromPoint = this.tiledeskConnectors.elementLogicCenter(elFrom);
      const toPoint = this.tiledeskConnectors.elementLogicTopLeft(elTo);
      this.tiledeskConnectors.createConnector(fromId, toId, fromPoint,toPoint);
    }
  }
  
  /** */
  deleteConnector(connectorID){
    this.tiledeskConnectors.deleteConnector(connectorID);
  }

  onConnectorDeleted(connectorID){
    delete this.listOfConnectors[connectorID];
  }

  addConnector(connector){
    this.listOfConnectors[connector.id] = connector;
  }
  

 

  deleteConnectorsOfBlock(intent_id){
    this.tiledeskConnectors.deleteConnectorsOfBlock(intent_id);
  }

  deleteConnectorFromAction(actionId, connId){
    this.tiledeskConnectors.deleteConnectorFromAction(actionId, connId);
  }

  deleteConnectorsFromActionByActionId(actionId){
    this.tiledeskConnectors.deleteConnectorsFromActionByActionId(actionId);
  }

  movedConnector(elem){
    console.log('movedConnector: ', elem);
    setTimeout(() => {
      this.tiledeskConnectors.updateConnectorsOutOfItent(elem);
    }, 500);
  }


}