import React from 'react';
import { RegisterNode } from 'gg-editor';

export const nodeType = {
  Bot: 'bot-node',
  Customer: 'customer-node',
  Agent: 'agent-node',
  ReturnData: 'return-data-node',
};

class CustomNode extends React.Component {
  setConfig() {
    let label;
    let icon;
    let customizedStatus = [];
    let isActiveAvailable = false;
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);

        const group = item.getGraphicGroup();
        const model = item.getModel();

        label = group.addShape('text', {
          class: 'customizedLabel',
          attrs: {
            text: model.text,
            x: 0,
            y: 0,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: 'black',
            fontSize: 12,
            editable: true,
          },
        });

        icon = group.addShape('image', {
          attrs: {
            x: -80,
            y: -10,
            width: 20,
            height: 20,
            img: model.icon,
          },
        });

        const listStatusById = customizedStatus.filter((el) => el.id == group.id);
        if (listStatusById.length) {
          listStatusById[0].label = label;
          listStatusById[0].icon = icon;
        } else
          customizedStatus.push({
            id: group.id,
            label: label,
            icon: icon,
          });

        this.drawLabel(item);

        return keyShape;
      },

      getStyle(item) {
        isActiveAvailable = false;
        const listStatusById = customizedStatus.filter((el) => el.id == item.id);
        const nodeStyle = listStatusById[listStatusById.length - 1];
        const l = nodeStyle?.label;
        const ic = nodeStyle?.icon;
        const model = item.getModel();
        if (l?._attrs) {
          l?.attr('fill', 'black');
          ic?.attr('img', model.icon);
        }
        return {
          stroke: model.border,
          radius: 10,
          fill: model.color,
        };
      },

      getSelectedStyle(item) {
        const listStatusById = customizedStatus.filter((el) => el.id == item.id);
        const nodeStyle = listStatusById[listStatusById.length - 1];
        const l = nodeStyle?.label;
        const ic = nodeStyle?.icon;
        const model = item.getModel();
        if (isActiveAvailable) {
          l?.attr('fill', 'white');
          ic?.attr('img', model.iconFocus);
          return { fill: model.colorFocus };
        } else return { fill: model.color };
      },

      getSelectedOutterStyle() {
        isActiveAvailable = true;
        return {};
      },

      // getSelectedStyle(item) {
      //   const listStatusById = customizedStatus.filter((el) => el.id == item.id);
      //   const nodeStyle = listStatusById[listStatusById.length - 1];
      //   const l = nodeStyle.label;
      //   const ic = nodeStyle.icon;
      //   const model = item.getModel();

      //   if (l?.attr('fill') == 'black') {
      //     l?.attr('fill', 'white');

      //     ic?.attr('img', model.iconFocus);
      //     return {
      //       fill: model.colorFocus,
      //     };
      //   } else {
      //     l?.attr('fill', 'black');
      //     ic?.attr('img', model.icon);

      //     return {
      //       stroke: model.border,
      //       radius: 10,
      //       lineWidth: 1,
      //       fill: model.color,
      //     };
      //   }
      // },

      // getStyle(item) {
      //   const model = item.getModel();
      //   return {
      //     stroke: model.border,
      //     radius: 10,
      //     lineWidth: 1,
      //     fill: model.color,
      //   };
      // },

      // anchor(item) {
      //   return [];
      // },
      anchor: [
        [0, 0.5],
        [1, 0.5],
      ],
    };

    return config;
  }

  // Flow.registerNode('diamond',{
  //   draw(item) {
  //   const group = item.getGraphicGroup();
  //   const model = item.getModel();
  //   const width = 40;
  //   const height = 30;
  //   const keyShape = group.addShape('path',{
  //   attrs: {
  //   path: [
  //   ['customizedLabel', 0, -height], // 上部左侧顶点(起点)
  //   ['L', width, 0], // 上部右侧顶点
  //   ['L', 0, height], // 下部右侧
  //   ['L', -width, 0], // 下部左侧
  //   ['Z'] // 封闭
  //   ],
  //   fill: "#A3B1BF",
  //   stroke: "#A3B1BF"
  //   }
  //   });
  //   // 名称文本
  //   const label = model.label ? model.label : this.label;
  //   group.addShape('text', {
  //   attrs: {
  //   text: label,
  //   x: 0,
  //   y: 0,
  //   textAlign: 'center',
  //   textBaseline: 'middle',
  //   fill: 'rgba(0,0,0,0.65)'
  //   }
  //   });
  //   return keyShape;
  //   },
  //   // 设置锚点
  //   anchor: [
  //   [ 0, 0.5, {
  //   type: 'input'
  //   }], // 左边中点
  //   [ 1, 0.5, {
  //   type: 'output'
  //   }], // 右边中点
  //   ],
  //   getStyle: function(t) {
  //   return { fill: "#A3B1BF", stroke: "#A3B1BF"};
  //   },
  //   getActivedStyle: function() {
  //   return { fill: "#A3B1BF", stroke: "#A3B1BF"};
  //   },
  //   getSelectedStyle: function() {
  //   return { fill: "#A3B1BF", stroke: "#A3B1BF"};
  //   },
  //   getActivedOutterStyle: function() {
  //   return { fill: "#A3B1BF", stroke: "#A3B1BF"};
  //   },
  //   getSelectedOutterStyle: function() {
  //   return { fill: "#A3B1BF", stroke: "#A3B1BF"};
  //   },
  //   });

  render() {
    return <RegisterNode name="custom-node" config={this.setConfig()} extend={'flow-rect'} />;
  }
}

export default CustomNode;
