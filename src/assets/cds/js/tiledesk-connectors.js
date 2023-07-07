export class TiledeskConnectors {

    constructor(drawerId, classes, connectors) {
      //this.connectors = [];
      this.svgContainerId = "tds_svgContainer";
      this.svgConnectorsId = "tds_svgConnectors";
      this.classes = {
        "connector_selected": "tds_connector_selected",
        "input_block": "tds_input_block",
        "connectable": "tds_connectable",
        "connector": "tds_connector",
        "connector_over": "tds_connector_over",
        "path": "tds_path"
      }
      if (classes && classes["connector_selected"]) {
        this.classes["connector_selected"] = classes["connector_selected"];
      }
      if (classes && classes["input_block"]) {
        this.classes["input_block"] = classes["input_block"];
      }
      if (classes && classes["connectable"]) {
        this.classes["connectable"] = classes["connectable"];
      }
      if (classes && classes["connector"]) {
        this.classes["connector"] = classes["connector"];
      }
      if (classes && classes["connector_over"]) {
        this.classes["connector_over"] = classes["connector_over"];
      }
      if (classes && classes["path"]) {
        this.classes["path"] = classes["path"];
      }

      if(connectors){
        this.connectors = connectors;
      } else {
        this.connectors = {};
      }
      this.blocks = {};

      
      // this.svgContainer = document.getElementById("svgConnectors");
      this.drawerId = drawerId;
      this.scale = 1;
      // connector draft drawing (cubic bezier)
      this.drawingBack = { x: 0, y: 0 };
      this.controlBack = { x: 0, y: 0 };
      this.drawingFront = { x: 0, y: 0 };
      this.controlFront = { x: 0, y: 0 };
      this.selectedConnector = null;


      this.#createSvgContainer();
      this.#createConnectors();
      this.#setEventListners();

    }


    #setEventListners(){
      this.deleteConnector = this.deleteConnector.bind(this);
      document.addEventListener('keydown',this.deleteConnector);
    }


    
    deleteConnector(event) {
      console.log('onDeleteConnector:::: ' , event.key, this.selectedConnector);
      if (event.key === 'Delete' || event.key === 'Backspace' && this.selectedConnector) {
        let connector = document.getElementById(this.selectedConnector.id);
        if (connector) {
          connector.remove();
          const connectorDeleted = this.connectors[this.selectedConnector.id];
          delete this.connectors[this.selectedConnector.id];

          // const parentBlockId = connectorDeleted.fromId.split("/")[0];
          // const destBlockId = connectorDeleted.toId.split("/")[0];
          // delete this.connectors[this.selectedConnector.id];
          // delete this.blocks[parentBlockId];
          // delete this.blocks[destBlockId];

          console.log('this.connectors: ', this.connectors, connectorDeleted);
          const customEvent = new CustomEvent("connector-deleted", { detail: {connector: connectorDeleted} });
          document.dispatchEvent(customEvent);
        }
      }
    }





    // PUBLIC FUNCTIONS //

  
    createConnector(fromId, toId, fromPoint, toPoint) {
      const id = fromId + "/" + toId;
      console.log('createConnector: fromId-> ', fromId);
      console.log('createConnector: toId-> ', toId);
      console.log('createConnector: point-> ', fromPoint, toPoint);
      // condition example id
      // "start_blockID/actionID/(sub-action path, ex: true)/end_blockID"
      // fromId: "block1/action1/true"
      // toId: "block2"
      // id = fromId + "/" + toId
      let connector = {
        id: id,
        fromId: fromId,
        toId: toId,
        fromPoint: fromPoint,
        toPoint: toPoint
      }
      //this.connectors.push(connector);
      this.connectors[connector.id] = connector;
  
      // connector as outConnector in outBlock
      const parentBlockId = fromId.split("/")[0];
      //let outblock = this.blocks.get(parentBlockId);
      let outblock = this.blocks[parentBlockId];
      if (!outblock) {
        outblock = this.createBlock(parentBlockId);
        //this.blocks.set(outblock.id, outblock);
        this.blocks[outblock.id] = outblock;
      }
      //outblock.outConnectors.set(connector.id, connector.id);
      outblock.outConnectors[connector.id] = connector.id;
  
      // connector as outConnector in outBlock
      const destBlockId = toId.split("/")[0];
      let inblock = this.blocks[destBlockId];
      if (!inblock) {
        inblock = this.createBlock(destBlockId);
        this.blocks[inblock.id] = inblock;
      }
      inblock.inConnectors[connector.id] = connector.id;
      //block.addConnector()
      console.log("blocks:", this.blocks);
      console.log("connectors:", this.connectors);

      this.#drawConnector(id, fromPoint, toPoint);
      this.removeConnectorDraft();

      const event = new CustomEvent("connector-created", { detail: {connector: connector} });
      document.dispatchEvent(event);
    }
  
    /** */
    createBlock(blockId) {
      let block = {
        id: blockId
      }
      block.inConnectors = {}; //new Map();
      block.outConnectors = {}; //new Map();
      return block;
    }
  
    /** */
    updateBlockPosition(blockId, x, y) {
      let block = this.blocks.get(blockId);
      if (block) {
        block.x = x;
        block.y = y;
      }
    }
  
    /** */
    mousedown(target) {
      this.target = target;
      if (target.addEventListener) {
        target.addEventListener("mousedown", (event) => {
            // console.log("mousedown  el.id:", event.target.id);
            let el = event.target;
            this.#removeSelection(el);
            let elConnectable = this.#searchClassInParents(el, this.classes["connectable"]);
            // console.log("connectable? ", elConnectable);
            if(elConnectable){
              // console.log("connectable", elConnectable.id);
              this.fromId = elConnectable.id;
              this.drawingBack = this.elementLogicCenter(elConnectable);
              this.ref_handleMouseMove;
              this.ref_handleMouseUp;
              target.addEventListener("mousemove", this.ref_handleMouseMove = this.#handleMouseMove.bind(this), false);
              target.addEventListener("mouseup", this.ref_handleMouseUp = this.#handleMouseUp.bind(this), false);
            }
            else {
              console.log("un-connectable");
            }
        }, false);
        /* 
        target.addEventListener("click", (event) => {
            console.log("clicked el.id:", event.target.id)
            let el = event.target;
            this.#removeSelection(el);
        }, false);
        */
        console.log("mouse down added");
      }
    }
  

  
  
    removeConnectorDraft() {
      let connector = document.getElementById("connectorDraft");
      if (connector) {
        connector.remove();
      }
    }


    moved(element, x, y) {
      console.log("moving ----> ", element.id, x, y);
      const blockId = element.id;
      let block = this.blocks[blockId];
      if (!block) {
        console.log("NO block:");
        return;
      }
      console.log("block:---> ", block)
      //block.outConnectors.forEach((conn_id, key) => {
      for (const [key, conn_id] of Object.entries(block.outConnectors)) {
        // for (k in block.outConnectors.keys) {
        // c_id = block.outConnectors[k];
        let conn = this.connectors[conn_id];

        console.log("OUT :---> ", conn);
        if(conn){
          const el = document.getElementById(conn.fromId);
          conn.fromPoint = this.elementLogicCenter(el);
          console.log("conn.fromPoint :---> ", conn.fromPoint);
          this.#drawConnector(conn.id, conn.fromPoint, conn.toPoint);
        }
      };
      // block.inConnectors.forEach((conn_id, key) => {
      for (const [key, conn_id] of Object.entries(block.inConnectors)) {
        //for (k in block.inConnectors.keys) {
        //c_id = block.inConnectors[k]
        //let conn = this.connectors.get(conn_id);
        let conn = this.connectors[conn_id];
        if(conn){
          conn.toPoint.x = x;
          conn.toPoint.y = y + 20;
          this.#drawConnector(conn.id, conn.fromPoint, conn.toPoint);
        }
      };
    }
  



    /** PRIVATE FUNCTIONS */

    /** createSvgContainer */
    #createSvgContainer(){
      const drawer = document.getElementById(this.drawerId);
      if(!drawer)return;
      let svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgContainer.id = this.svgContainerId;
      svgContainer.style.overflow = "visible";
      svgContainer.style.left = "0px";
      svgContainer.style.top = "0px";
      svgContainer.style.position = "absolute";
      svgContainer.style.zIndex = "-1";
      var gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gElement.id = this.svgConnectorsId;
      gElement.setAttribute("fill", "white");
      gElement.setAttribute("stroke", "black");
      gElement.setAttribute("stroke-width", "2");
      svgContainer.appendChild(gElement);
      
      drawer.appendChild(svgContainer);
      this.svgContainer = document.getElementById(this.svgConnectorsId);
    }

    /** createConnectors */
    #createConnectors() {
      //console.log('createConnectors: ', this.connectors);
      for (const [key, value] of Object.entries(this.connectors)) {
        // const id = value.fromId + "/" + value.toId;
        // this.#drawConnector(id, value.fromPoint, value.toPoint);
        this.createConnector(value.fromId, value.toId, value.fromPoint, value.toPoint);
      }
    }

    /** searchClassInParents */ 
    #searchClassInParents(el, keyClass) {
      if(el.classList.contains(keyClass)){
        return el;
      }
      let parent = el.parentElement;
      while (parent !== null) {
        if(parent.classList.contains(keyClass)){
          return parent;
        } 
        if(parent.parentElement){
          parent = parent.parentElement;
        } else {
          parent = null;
        }
      }
      // console.log("Nessun elemento parent contiene la classe 'pippo'.");
      return null;   
    }

    /** removeSelection */
    #removeSelection(target) {
      console.log("resetting connector selection?", this.selectedConnector, target)
      if (this.selectedConnector) {
        if (!target.id || (this.selectedConnector.id !== target.id)) {
          this.selectedConnector.setAttributeNS(null, "class", "connector");
          this.selectedConnector = null;
        }
      }
    }


    /** handleMouseMove */
    #handleMouseMove(event) {
      //console.log("move...", event.target.id);
      let mouse_pos_logic;
      const target = event.target;
      let elConnectable = this.#searchClassInParents(target, this.classes["input_block"]);
      console.log("connectable? ", elConnectable);
      if(elConnectable){
        const block_rect = elConnectable.getBoundingClientRect();
        let pos_x_phis = block_rect.left;
        let pos_y_phis = block_rect.top;
        mouse_pos_logic = this.logicPoint({ x: pos_x_phis, y: pos_y_phis });
        mouse_pos_logic.y = mouse_pos_logic.y + 20;
        this.toPoint = mouse_pos_logic;
        this.toPointPhis = { x: pos_x_phis, y: pos_y_phis };
      }
      else {
        let pos_x_phis = event.clientX;
        let pos_y_phis = event.clientY;
        mouse_pos_logic = this.logicPoint({ x: pos_x_phis, y: pos_y_phis });
        this.toPoint = mouse_pos_logic;
        this.toPointPhis = { x: pos_x_phis, y: pos_y_phis };
      }
      this.drawingFront = mouse_pos_logic;
      this.#moveControlPoint();
    }
  
    /** handleMouseUp */
    #handleMouseUp(event) {
      //console.log("mouse up event...", event);
      this.target.removeEventListener("mousemove", this.ref_handleMouseMove, false);
      this.target.removeEventListener("mouseup", this.ref_handleMouseUp, false);
      console.log('handleMouseUp ------> ', event.target, event.srcElement);
      let elConnectable = this.#searchClassInParents(event.target, this.classes["input_block"]);
      console.log("connectable? ", elConnectable);
      if(elConnectable){
      //if (event.target.classList.contains(this.classes["input_block"])) {
        this.createConnector(this.fromId, elConnectable.id, this.drawingBack, this.toPoint);
      }
      else {
        //console.log("connector released on an unsupported element!");
        //this.removeConnectorDraft();
        const fire_event = new CustomEvent("connector-draft-released",
        {
          detail: {
            fromId: this.fromId,
            fromPoint: this.drawingBack,
            toPoint: this.toPoint,
            menuPoint: this.toPointPhis,
            target: event.target
          }
        });
        document.dispatchEvent(fire_event);
        console.log("connector-draft-released fired!");
      }
    }
  
    /** moveControlPoint */
    #moveControlPoint() {
      this.#updateControlPoints();
      this.#drawConnectorDraft();
    }
  
    /** updateControlPoints */
    #updateControlPoints() {
      if (this.drawingFront.x < this.drawingBack.x) {
        const front_back_dist_x = this.drawingBack.x - this.drawingFront.x;
        this.controlFront.x = this.drawingFront.x - (front_back_dist_x);
        this.controlBack.x = this.drawingBack.x + (front_back_dist_x);
      } else { 
        const front_back_half_dist = Math.round((this.drawingFront.x - this.drawingBack.x) / 2);
        this.controlFront.x = this.drawingBack.x + front_back_half_dist;
        this.controlBack.x = this.drawingBack.x + front_back_half_dist;
      }
      this.controlFront.y = this.drawingFront.y;
      this.controlBack.y = this.drawingBack.y;
    }
   
    /** drawConnectorDraft */
    #drawConnectorDraft() {
      let connector = document.getElementById("connectorDraft");
      if (!connector) {
        connector = document.createElementNS("http://www.w3.org/2000/svg", "path");
        connector.setAttributeNS(null, "fill", "transparent");
        connector.setAttributeNS(null, "id", "connectorDraft");
        this.svgContainer.appendChild(connector);
      }
      let d = "M" + this.drawingFront.x + " " + this.drawingFront.y + " " + "C " + this.controlFront.x + " " + this.controlFront.y + " " + this.controlBack.x + " " + this.controlBack.y + " " + this.drawingBack.x + " " + this.drawingBack.y;
      connector.setAttributeNS(null, "d", d);
      connector.setAttributeNS(null, "class", this.classes["path"]);
      
    }
  
    /** Creates or modify a connector in HTML */
    #drawConnector(id, backPoint, frontPoint) {
      // console.log(id, backPoint, frontPoint);
      let connector = document.getElementById(id);
      if (!connector) {
        connector = document.createElementNS("http://www.w3.org/2000/svg", "path");
        connector.setAttributeNS(null, "fill", "transparent");
        connector.setAttributeNS(null, "id", id);
        connector.setAttributeNS(null, "class", this.classes["connector"]);
        connector.setAttributeNS(null, "pointer-events", "stroke");
        connector.addEventListener('mouseover', (e) => {
          console.log("mouseover e", e.currentTarget);
          if (this.selectedConnector !== null) { // jump highlighting current selection
            if (this.selectedConnector.id !== e.currentTarget.id) {
              e.currentTarget.setAttributeNS(null, "class", this.classes["connector_over"]);
            }
          }
          else {
            e.currentTarget.setAttributeNS(null, "class", this.classes["connector_over"]);
          }
        });
        connector.addEventListener('mouseleave', (e) => {
          console.log("mouseleave e", e.currentTarget);
          if (!e.currentTarget.classList.contains(this.classes["connector_selected"])) {
            e.currentTarget.setAttributeNS(null, "class", this.classes["connector"]);
          }
        });
        connector.addEventListener('click', (e) => {
          if (this.selectedConnector) {
            this.selectedConnector.setAttributeNS(null, "class", this.classes["connector"]);
          }
          this.selectedConnector = e.currentTarget;
          this.selectedConnector.setAttributeNS(null, "class", this.classes["connector_selected"]);
          console.log("clicked e", this.selectedConnector);
        });
        this.svgContainer.appendChild(connector);
      }

      // control points
      let controlFront = { x: 0, y: 0 };
      let controlBack = { x: 0, y: 0 };
      if (frontPoint.x < backPoint.x) {
        const front_back_dist_x = backPoint.x - frontPoint.x;
        controlFront.x = frontPoint.x - (front_back_dist_x);
        controlBack.x = backPoint.x + (front_back_dist_x);
      }
      else {
        const front_back_half_dist = Math.round((frontPoint.x - backPoint.x) / 2);
        controlFront.x = backPoint.x + front_back_half_dist;
        controlBack.x = backPoint.x + front_back_half_dist;
      }
      controlFront.y = frontPoint.y;
      controlBack.y = backPoint.y;
      let d = "M" + frontPoint.x + " " + frontPoint.y + " " + "C " + controlFront.x + " " + controlFront.y + " " + controlBack.x + " " + controlBack.y + " " + backPoint.x + " " + backPoint.y;
      connector.setAttributeNS(null, "d", d);

      // connector.setAttributeNS(null, "tabindex", "0");
      // connector.setAttributeNS(null, "keydown", "deleteConnector(event)");
      //connector.setAttributeNS(null, "stroke", "#FF0000");
      //connector.setAttributeNS(null, "stroke-width", "1px");
    }
  

    /** Measure from phisical to logical */


    #toLogicScale(measure) {
      return measure / this.scale;
    }
  
    /** Coordinate from phisical to logical */
    logicPoint(coords) {
      const drawer = document.getElementById(this.drawerId);
      var drawer_rect = drawer.getBoundingClientRect();
      // https://stackoverflow.com/questions/24883585/mouse-coordinates-dont-match-after-scaling-and-panning-canvas
      const shift_x = this.#toLogicScale(drawer_rect.left); //d_rect.left / scale
      const shift_y = this.#toLogicScale(drawer_rect.top); //d_rect.top / scale
      const x = this.#toLogicScale(coords.x) - shift_x; //mouse_x / scale - shift_x
      const y = this.#toLogicScale(coords.y) - shift_y; //(mouse_y) / scale - shift_y
      return { x: x, y: y };
    }
  
    /** elementLogicCenter */
    elementLogicCenter(element) {
      const rect = element.getBoundingClientRect();
      //console.log("Logic center of phisical rect:", rect);
      let logic_rect_pos = this.logicPoint({ x: rect.left, y: rect.top })
      //console.log("center: logic_rect_pos:", logic_rect_pos);
      const logic_width = this.#toLogicScale(rect.width);
      //console.log("center: logic_width:", logic_width);
      const logic_height = this.#toLogicScale(rect.height);
      //console.log("center: logic_height:", logic_height);
      let center_x = logic_rect_pos.x + logic_width / 2;
      let center_y = logic_rect_pos.y + logic_height / 2;
      //console.log("center_x:", center_x);
      //console.log("center_y:", center_y);
      return { x: center_x, y: center_y };
    }

    elementLogicTopLeft(element) {
      let elConnectable = this.#searchClassInParents(element, this.classes["input_block"]);
      if(elConnectable){
        const block_rect = elConnectable.getBoundingClientRect();
        let pos_x_phis = block_rect.left;
        let pos_y_phis = block_rect.top;
        let mouse_pos_logic = this.logicPoint({ x: pos_x_phis, y: pos_y_phis });
        mouse_pos_logic.y = mouse_pos_logic.y + 20;
        // console.log("toPoint? ", elConnectable);
        // console.log("mouse_pos_logic? ", mouse_pos_logic);
        // console.log("pos_y_phis? ", pos_y_phis);
        return mouse_pos_logic;
      }
    }
  
  



    createConnectorFromId(fromId, toId){
      const fromEle = document.getElementById(fromId);
      const toEle = document.getElementById(toId);
      console.log("fromEle:", fromEle);
      console.log("toEle:", toEle);
      const fromPoint = this.elementLogicCenter(fromEle);
      const toPoint = this.elementLogicTopLeft(toEle);
      console.log("toPoint:", toPoint);
      console.log("fromPoint:", fromPoint);
      this.createConnector(fromId, toId, fromPoint, toPoint);
    }



    updateConnectorsOutOfItent(element) {
      console.log("updateConnectorsOutOfItent ----> ", element.id);
      const blockId = element.id;
      let block = this.blocks[blockId];
      if (!block) {return;}
      for (const [key, conn_id] of Object.entries(block.outConnectors)) {
        let conn = this.connectors[conn_id];
        console.log("OUT :---> ", conn.fromPoint);
        if(conn){
          const el = document.getElementById(conn.fromId);
          conn.fromPoint = this.elementLogicCenter(el);
          console.log("conn.fromPoint :---> ", el, conn.fromId, conn.fromPoint);
          this.#drawConnector(conn.id, conn.fromPoint, conn.toPoint);
        }
      };
    }


    deleteConnectorFromAction(blockId, connId) {
      console.log("deleteConnectorFromAction ----> ", connId, blockId);
      console.log("blocks :---> ", this.blocks);
      console.log("connectors :---> ", this.connectors);
      let block = this.blocks[blockId];
      if(!block)return;
      for (var connectorKey in block.outConnectors) {
        if (connectorKey.startsWith(connId)) {
          delete block.outConnectors[connectorKey];
          let connector = document.getElementById(connectorKey);
          if (connector) {
            connector.remove();
            delete this.connectors[connectorKey];
          }
        }
      }
    }


    deleteConnectorsOfBlock(blockId) {
      console.log("deleteConnectors ----> ", this.blocks, blockId);
      const blockToDelete = this.blocks[blockId];
      if(!blockToDelete)return;
      for (const [key, conn_id] of Object.entries(blockToDelete?.outConnectors)) {
        let connector = document.getElementById(conn_id);
        if (connector) {
          connector.remove();
          delete this.connectors[conn_id];
        }
      }
      delete this.blocks[blockId];
      console.log("blocks :---> ", this.blocks);
      console.log("connectors :---> ", this.connectors);
      for (var key in this.blocks) {
        var node = this.blocks[key];
        for (var connectorKey in node.inConnectors) {
          if (connectorKey.startsWith(blockId)) {
            delete node.inConnectors[connectorKey];
          }
        }
      }
    }
    
  }