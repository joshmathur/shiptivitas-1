import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

const STATUS_BY_LANE = {
  backlog: 'backlog',
  inProgress: 'in-progress',
  complete: 'complete',
};

export default class Board extends React.Component {
  constructor(props) {
  super(props);
  const clients = this.getClients().map(client => ({ ...client, status: 'backlog' }));
  this.state = {
    clients: {
      backlog: clients,
      inProgress: [],
      complete: [],
    }
  }
  this.swimlanes = {
    backlog: React.createRef(),
    inProgress: React.createRef(),
    complete: React.createRef(),
  }
}

componentDidMount() {
  const containers = [
    this.swimlanes.backlog.current,
    this.swimlanes.inProgress.current,
    this.swimlanes.complete.current,
  ];
  this.drake = Dragula(containers);

  let originalNextSibling = null;

  this.drake.on('drag', (el) => {
    originalNextSibling = el.nextSibling;
  });

  this.drake.on('drop', (el, target, source, sibling) => {
    const id = el.dataset.id;
    const targetLane = this.getLaneFromContainer(target);
    const sourceLane = this.getLaneFromContainer(source);
    const siblingId = sibling ? sibling.dataset.id : null;

    if (originalNextSibling) {
      source.insertBefore(el, originalNextSibling);
    } else {
      source.appendChild(el);
    }

    this.moveClient(id, sourceLane, targetLane, siblingId);
  });
}
getLaneFromContainer(container) {
  if (container === this.swimlanes.backlog.current) return 'backlog';
  if (container === this.swimlanes.inProgress.current) return 'inProgress';
  if (container === this.swimlanes.complete.current) return 'complete';
  return null;
}
componentWillUnmount() {
  if (this.drake) {
    this.drake.destroy();
  }
}

moveClient(id, sourceLane, targetLane, siblingId) {
  if (!sourceLane || !targetLane) return;
  this.setState(prevState => {
    const clients = { ...prevState.clients };
    const sourceList = [...clients[sourceLane]];
    const targetList = sourceLane === targetLane ? sourceList : [...clients[targetLane]];

    const idx = sourceList.findIndex(client => client.id === id);
    if (idx === -1) return null;
    const [client] = sourceList.splice(idx, 1);
    const movedClient = { ...client, status: STATUS_BY_LANE[targetLane] };

    let insertIdx = targetList.length;
    if (siblingId) {
      const siblingIdx = targetList.findIndex(c => c.id === siblingId);
      if (siblingIdx !== -1) insertIdx = siblingIdx;
    }
    targetList.splice(insertIdx, 0, movedClient);

    clients[sourceLane] = sourceList;
    clients[targetLane] = targetList;

    return { clients };
  });
}
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, laneId, clients, ref) {
    return (
      <Swimlane name={name} LaneId={laneId} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', 'backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', 'inProgress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', 'complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
