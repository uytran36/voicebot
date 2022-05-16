import React from 'react';
import { RegisterBehaviour } from 'gg-editor';

const nodeSelectBehavior = (page) => {
  //   console.log('page', page);
  //   page.on('anchor:mouseenter', (ev) => {
  //     //console.log('Here is an example behavior');
  //     console.log('ev', ev);
  //     ev?.shape?.setHotspotActived();
  //   });
};

const ExampleBehaviour = () => (
  <RegisterBehaviour name="hoverAnchorActived" behaviour={nodeSelectBehavior} />
);

export default ExampleBehaviour;
