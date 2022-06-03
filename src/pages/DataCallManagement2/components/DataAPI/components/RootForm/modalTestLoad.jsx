import React, { useState, useEffect } from 'react';
import { Modal, Table, Col, Typography } from 'antd';
import { testLoadAPIData } from '../DataTable/function';
const isString = (str) => typeof str === 'string';
const { Title } = Typography;

const ModalTestLoad = (props) => {
    const [data, setData] = useState({});
    const {
        strategy,
        configuration,
        setIsModalVisible,
        isModalVisible,
        headers
    } = props;

    const handleTestloadAPIData = async () => {
        if (configuration && strategy) {
            const value = {
                ...JSON.parse(configuration),
                strategy,
            }
            const result = await testLoadAPIData(headers, value);
            if (!result) {
                setIsModalVisible(false);
            }
            setData(result);
        }
    };

    useEffect(() => {
        handleTestloadAPIData();
    }, [])

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (data?.length > 0) {
        const columns = [];
        Object.keys(data[0]).forEach(elm => {
            if (isString(elm)) {
                columns.push({
                    title: elm,
                    dataIndex: elm,
                    align: 'center',
                })
            }
        })
        return (
            <Modal title={
                <Col span={4} offset={10}>
                    <Title level={4}>Test load dữ liệu</Title>
                </Col>} width={1200} centered
                visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <Table dataSource={data} columns={columns} />;
            </Modal>
        )
    } else return <></>
}

export default ModalTestLoad