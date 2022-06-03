import { withPropsAPI } from 'gg-editor';
import React from 'react';
import { nodeType } from './CustomFlowElement/customNode';
import { Popover } from 'antd';
import { message } from 'antd';
import { conditionalNodeOption } from './EditSide';

const listNodes = {
  botNode: {
    icon: '/icons/FlowIcon/bot.png',
    color: '#C7E7FF',
    label: 'Bot Node',
    type: nodeType.Bot,

    borderColor: '#127ACE',
    iconFocus: '/icons/FlowIcon/bot-fill.png',
    colorFocus: '#45ACFF',
  },
  customerNode: {
    icon: '/icons/FlowIcon/customer.png',
    color: '#FFF8EA',
    label: 'khách hàng Node',
    type: nodeType.Customer,

    borderColor: '#FAAD14',
    iconFocus: '/icons/FlowIcon/customer-fill.png',
    colorFocus: '#FFC852',
  },
  AgentNode: {
    icon: '/icons/FlowIcon/agent.png',
    color: '#D7FFD7',
    label: 'Kết nổi tổng đài viên',
    type: nodeType.Agent,

    borderColor: '#1EAF61',
    iconFocus: '/icons/FlowIcon/agent-fill.png',
    colorFocus: '#5BE358',
  },
  ExportNode: {
    icon: '/icons/FlowIcon/export.png',
    color: '#DECEFF',
    label: 'Trả dữ liệu',
    type: nodeType.ReturnData,

    borderColor: '#7F10D6',
    iconFocus: '/icons/FlowIcon/export-fill.png',
    colorFocus: '#A279F9',
  },
};

const listActions = {
  Link: {
    icon: '/icons/FlowIcon/connect.png',
    color: '',
    label: 'Liên kết tới Node',
    type: nodeType.Connect,
  },
  UnLink: {
    icon: '/icons/FlowIcon/disconnect.png',
    color: '',
    label: 'Bỏ liên kết',
    type: nodeType.Disconnect,
  },
  Remove: {
    icon: '/icons/FlowIcon/remove.png',
    color: '',
    label: 'Xóa Node',
    type: nodeType.Remove,
  },
};

class PopUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.generateItem = this.generateItem.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.filterGenAbleNode = this.filterGenAbleNode.bind(this);
    this.itemsByNode = [];
  }

  updateItems(shape) {
    const type = shape || this.props.nodeType;
    switch (type) {
      case nodeType.Bot:
        this.itemsByNode = [
          listNodes.botNode,
          listNodes.customerNode,
          listNodes.AgentNode,
          listNodes.ExportNode,
        ];
        break;

      case nodeType.Customer:
        this.itemsByNode = [listNodes.botNode, listNodes.ExportNode];
        break;

      case nodeType.Agent:
        this.itemsByNode = [listNodes.ExportNode];
        break;

      default:
        break;
    }

    this.setState({
      items: this.itemsByNode,
    });
  }

  filterGenAbleNode() {
    const { propsAPI } = this.props;
    const { getSelected, save } = propsAPI;

    const thisNode = getSelected()[0]?.model;
    const allNodes = save().nodes;
    const allEdges = save().edges;

    if (
      thisNode?.info?.type === conditionalNodeOption.notInteract &&
      thisNode?.info?.details?.isCheckRepeat
    ) {
      this.itemsByNode = [];
      this.setState({
        items: this.itemsByNode,
      });
      return;
    }
    if (thisNode?.id) {
      const AllNodeAfterThisNode =
        allNodes.filter((n) => {
          const i = allEdges?.findIndex((ed) => ed.source == thisNode.id && ed.target == n.id);
          return i !== -1 && i !== undefined;
        }) || [];
      const lastNodeAfterThisNode = AllNodeAfterThisNode.pop();
      switch (lastNodeAfterThisNode?.nodeCustomizeType) {
        case nodeType.Customer:
          this.itemsByNode = [listNodes.customerNode];
          this.setState({
            items: this.itemsByNode,
          });
          break;

        case nodeType.Bot:
        case nodeType.Agent:
        case nodeType.ReturnData:
          this.itemsByNode = [];
          this.setState({
            items: this.itemsByNode,
          });
          break;

        default:
          this.updateItems(thisNode.nodeType); // trường hợp khi chưa có liên kết
          break;
      }

      //nút hiện tại có điều kiện không tương tác không kết nối với bot được
      switch (thisNode?.nodeCustomizeType) {
        case nodeType.Customer:
          if (
            thisNode?.info?.type === conditionalNodeOption.notInteract &&
            thisNode?.info?.details?.is_check_repeat
          ) {
            this.itemsByNode = [];
            this.setState({
              items: this.itemsByNode,
            });
          }
          break;

        default:
          break;
      }
    }
  }

  componentDidMount() {
    this.filterGenAbleNode();
  }

  componentWillReceiveProps(nextProps) {
    this.filterGenAbleNode();
  }

  generateItem(item) {
    this.props.hidePopUp();
    const { propsAPI } = this.props;
    const { getSelected, add, executeCommand, save } = propsAPI;
    let listNodesBeforeAdd = save().nodes;

    let x = getSelected()[0].model.x + 250;
    let y = getSelected()[0].model.y;

    while (listNodesBeforeAdd.findIndex((n) => n.x === x && n.y === y) !== -1) {
      y += 50;
    }

    const newNode = {
      x: x,
      y: y,
    };

    executeCommand(() => {
      add('node', {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: item.type,
        color: item.color,
        text: 'New Node',
        icon: item.icon,
        x: newNode.x,
        y: newNode.y,
        border: item.borderColor,
        colorFocus: item.colorFocus,
        iconFocus: item.iconFocus,
      });

      let listNodesAfterAdd = save().nodes;
      const addedNode = listNodesAfterAdd?.filter(
        (nA) => listNodesBeforeAdd?.findIndex((nB) => nB.id === nA.id) === -1,
      )[0];

      add('edge', {
        shape: 'custom-edge',
        source: getSelected()[0].id,
        target: addedNode.id,
        sourceAnchor: 1,
        targetAnchor: 3,
      });
    });
  }

  deleteNode() {
    this.props.hidePopUp();
    const { propsAPI } = this.props;
    const { getSelected, remove, executeCommand } = propsAPI;
    let item = getSelected()[0];
    executeCommand(() => {
      remove(item);
    });
    this.props.hidePopUp();
  }

  actionUnLink(id, listLink) {
    const { propsAPI } = this.props;
    const { remove, executeCommand, find } = propsAPI;
    const removeLink = listLink?.filter((link) => link.target == id)[0];
    executeCommand(() => {
      remove(find(removeLink.id));
    });
    this.props.hidePopUp();
  }

  renderUnlink() {
    const { propsAPI } = this.props;
    const { getSelected, save } = propsAPI;
    const thisNode = getSelected()[0];
    const allNode = save().nodes;
    const allLink = save().edges;
    if (allLink && thisNode?.id) {
      let linkByNode = allLink?.filter((i) => i.source == thisNode.id);
      let nodesByLink = allNode?.filter(
        (n) => linkByNode.findIndex((element) => element.target == n.id) !== -1,
      );

      if (!nodesByLink.length) return <div>Không có edges phù hợp</div>;

      const renderNodesByLink = nodesByLink?.map((i, index) => (
        <div
          onClick={() => this.actionUnLink(i.id, linkByNode)}
          style={{ cursor: 'pointer', margin: '10px' }}
          key={index}
        >
          <img src={i.icon} style={{ float: 'left', marginRight: '10px' }} />
          {i.text}
        </div>
      ));

      return renderNodesByLink;
    }
    return <div>Không có edges phù hợp</div>;
  }

  renderConnectableNode() {
    const { propsAPI } = this.props;
    const { getSelected, save } = propsAPI;
    const thisNode = getSelected()[0];
    const allNode = save().nodes;
    const allLink = save().edges;
    //khong co node nao lien ket toi no  + node thoa dieu kien + khong phai node dau tien + khong phai chinh no
    if (thisNode?.id) {
      let nodesNotConnected = allNode.filter(
        (n) =>
          (allLink == undefined || allLink?.findIndex((l) => l.target == n.id) == -1) &&
          n.id !== thisNode.id &&
          n.id !== '0' &&
          this.itemsByNode?.findIndex((i) => i.type == n.nodeCustomizeType) !== -1,
      );
      //node hiện tại chưa có liên kết tới node khác => có thể liên kết với tất cả node dữ liệu (đã có kết nối)
      const isNotConnectToAnyNode = allLink?.findIndex((l) => l.source == thisNode.id) === -1;

      if (isNotConnectToAnyNode)
        nodesNotConnected = nodesNotConnected?.concat(
          allNode?.filter(
            (n) =>
              n.nodeCustomizeType == nodeType.ReturnData &&
              allLink?.findIndex((l) => l.target == n.id) !== -1,
          ),
        );

      if (!nodesNotConnected.length) return <div>Không có nodes phù hợp</div>;

      //node condition interact option khong ket noi toi bot node
      switch (thisNode?.nodeCustomizeType) {
        case nodeType.Customer:
          if (
            thisNode?.info?.type === conditionalNodeOption.notInteract &&
            thisNode?.info?.details?.is_check_repeat
          ) {
            nodesNotConnected.removeIf(function (item, idx) {
              return item.nodeCustomizeType == nodeType.botNode;
            });
          }
          break;

        default:
          break;
      }

      const rendernodesNotConnected = nodesNotConnected?.map((i, index) => (
        <div
          onClick={() => this.actionLink(thisNode.id, i.id, thisNode, i)}
          style={{ cursor: 'pointer', margin: '10px' }}
          key={index}
        >
          <img src={i.icon} style={{ float: 'left', marginRight: '10px' }} />
          {i.text}
        </div>
      ));

      return rendernodesNotConnected;
    }
    return <div>Không có nodes phù hợp</div>;
  }

  actionLink(nodeSourceId, nodeTargetId, sourceNode, targetNode) {
    this.props.hidePopUp();
    const { propsAPI } = this.props;
    const { add, executeCommand } = propsAPI;
    if (
      this.checkDuplicateNotInteract(sourceNode, targetNode) &&
      targetNode?.info?.type == conditionalNodeOption.notInteract
    ) {
      message.warning('Đã tồn tại lựa chọn không tương tác!');
      return;
    }
    if (this.checkDuplicateCondition(sourceNode, targetNode)) {
      message.warning('Trùng giá trị điều kiện!');
      return;
    } else
      executeCommand(() => {
        add('edge', {
          source: nodeSourceId,
          target: nodeTargetId,
        });
      });
  }

  checkDuplicateCondition(sourceNode, targetNode) {
    if (targetNode.nodeCustomizeType == nodeType.Customer) {
      const { propsAPI } = this.props;
      const { save } = propsAPI;
      const allNode = save().nodes;
      const allLink = save().edges;
      const allEgesFromSameNode = allLink?.filter((ed) => ed.source === sourceNode.id);
      const allNodeSameSource = allNode?.filter(
        (n) => allEgesFromSameNode?.findIndex((ed) => ed.target === n.id) != -1,
      );

      const allConditionalNodes = allNodeSameSource?.filter(
        (n) => n.nodeCustomizeType === nodeType.Customer,
      );

      let listUsedCondition = [];
      allConditionalNodes.forEach((n) => {
        if (
          n.info?.type === conditionalNodeOption.pressNumber &&
          n.info?.details?.conditions !== undefined
        ) {
          listUsedCondition.push(...n.info?.details?.conditions);
        }
      });

      let isDuplicate;
      targetNode.info?.details?.conditions?.forEach((con) => {
        isDuplicate =
          listUsedCondition.findIndex(
            (c) => c.condition == con.condition && c.value == con.value,
          ) !== -1;
        if (isDuplicate) return true;
      });

      return isDuplicate;
    }
  }

  checkDuplicateNotInteract(sourceNode, targetNode) {
    if (targetNode.nodeCustomizeType == nodeType.Customer) {
      const { propsAPI } = this.props;
      const { save } = propsAPI;
      const allNode = save().nodes;
      const allLink = save().edges;
      const allEgesFromSameNode = allLink?.filter((ed) => ed.source === sourceNode.id);
      const allNodeSameSource = allNode?.filter(
        (n) => allEgesFromSameNode?.findIndex((ed) => ed.target === n.id) != -1,
      );

      const allConditionalNodes = allNodeSameSource?.filter(
        (n) => n.nodeCustomizeType === nodeType.Customer,
      );

      return (
        allConditionalNodes.filter((n) => n.info?.type === conditionalNodeOption.notInteract)
          .length > 0
      );
    }
  }

  render() {
    const { propsAPI } = this.props;
    const { getSelected, save } = propsAPI;
    const thisNode = getSelected()[0];

    let items = this.state.items;
    const showItem = items.map((item, index) => (
      <div
        onClick={() => this.generateItem(item)}
        style={{ cursor: 'pointer', margin: '10px' }}
        key={index}
      >
        <img src={item.icon} style={{ float: 'left', marginRight: '10px' }} />
        {item.label}
      </div>
    ));

    const showAction = (
      <>
        <Popover
          placement="right"
          content={() => this.renderConnectableNode()}
          trigger="click"
          key={Math.random()}
        >
          <div style={{ cursor: 'pointer', margin: '10px' }} key={listActions.Link.type}>
            <img src={listActions.Link.icon} style={{ float: 'left', marginRight: '10px' }} />
            {listActions.Link.label}
          </div>
        </Popover>

        <Popover
          placement="right"
          content={() => this.renderUnlink()}
          trigger="click"
          key={Math.random()}
        >
          <div style={{ cursor: 'pointer', margin: '10px' }} key={listActions.UnLink.type}>
            <img src={listActions.UnLink.icon} style={{ float: 'left', marginRight: '10px' }} />
            {listActions.UnLink.label}
          </div>
        </Popover>

        {thisNode?.id !== '0' && (
          <div
            onClick={() => {
              this.deleteNode();
            }}
            style={{ cursor: 'pointer', margin: '10px' }}
            key={listActions.Remove.type}
          >
            <img src={listActions.Remove.icon} style={{ float: 'left', marginRight: '10px' }} />
            {listActions.Remove.label}
          </div>
        )}
      </>
    );
    return (
      <>
        {showItem} {showAction}
      </>
    );
  }
}

export default withPropsAPI(PopUpModal);
