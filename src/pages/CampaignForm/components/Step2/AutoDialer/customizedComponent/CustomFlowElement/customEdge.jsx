import React from 'react';
import { RegisterEdge } from 'gg-editor';

class CustomEdge extends React.Component {
  render() {
    const config = {
      //   getStyle(item) {
      //     const model = item.getModel();
      //     const { color, size } = model;
      //     console.log(color, size, model);
      //     return {
      //       //   stroke: color,
      //       //   lineWidth: size,
      //       stroke: 'gray',
      //       lineWidth: 1,
      //     };
      //   },
      //   anchor(item) {
      //     return [];
      //   },
      //   getSelectedStyle(item) {
      //     return {};
      //   },
      //   getSelectedOutterStyle() {
      //     return {};
      //   },
      //   getActivedStyle() {
      //     console.log('active');
      //     return {};
      //   },
    };

    return (
      <RegisterEdge
        name="custom-edge"
        config={config}
        extend={
          'flow-smooth'
          /* 'flow-polyline-round' */
          /* 'flow-polyline' */
          /* 'flow-smooth' */
        }
      />
    );
  }
}

export default CustomEdge;
