import { Card, Tabs } from 'antd';
import PT from 'prop-types';

const { TabPane } = Tabs;

DialPlan.propTypes = {
  // props: PT.instanceOf(Object).isRequired,
  returnJSX: PT.func.isRequired,
  iframe: PT.instanceOf(Object).isRequired,
  content: PT.instanceOf(Array).isRequired,
};

function DialPlan(props) {
  const { returnJSX, content } = props;
  function callback(key) {
    // console.log(key);
  }
  const renderContent = (keyContent = []) => {
    return keyContent.map((item) => {
      return (
        <TabPane tab={item.name} key={item.name}>
          <Card>{returnJSX(item.content)}</Card>
        </TabPane>
      );
    });
  };

  return (
    <Tabs onChange={callback} type="card" tabBarStyle={{ marginBottom: '0px' }}>
      {renderContent(content)}
    </Tabs>
  );
}

export default DialPlan;
