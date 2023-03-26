import style from "./style.module.scss";
import { useState, useMemo } from "react";
import { Table, Typography, Button, Modal, Drawer, Select } from "antd";
import { Flex, Expanded, Spacer, Padding } from "../../components/utils";
import { MoreOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { PieChartOutlined } from "@ant-design/icons";
import { useAppStore } from "../../hooks/store";
import { dropColumn, wrangling, summary } from "../../apis/tableOperation";
import { saveData } from "../../apis/updateData";
import {
  wranglingFillingNANumericOptions,
  wranglingFillingNACategoricalOptions,
  wranglingNormalizationNumericOptions,
  wranglingNormalizationCategoricalOptions,
} from "./constants";
import { useWranglingFormStore } from "./formStore";

function DataTable() {
  const currentData = useAppStore((state) => state.currentData);
  const dataTable = useAppStore((state) => state.dataTable);
  const setDataTable = useAppStore((state) => state.setDataTable);
  const setStep = useAppStore((state) => state.setStep);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSummaryDrawerOpen, setIsSummaryDrawerOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  // Data Wrangling Form
  const fillingNANumeric = useWranglingFormStore(
    (state) => state.fillingNANumeric
  );
  const fillingNACategorical = useWranglingFormStore(
    (state) => state.fillingNACategorical
  );
  const normalizationNumeric = useWranglingFormStore(
    (state) => state.normalizationNumeric
  );
  const normalizationCategorical = useWranglingFormStore(
    (state) => state.normalizationCategorical
  );
  const setFillingNANumeric = useWranglingFormStore(
    (state) => state.setFillingNANumeric
  );
  const setFillingNACategorical = useWranglingFormStore(
    (state) => state.setFillingNACategorical
  );
  const setNormalizationNumeric = useWranglingFormStore(
    (state) => state.setNormalizationNumeric
  );
  const setNormalizationCategorical = useWranglingFormStore(
    (state) => state.setNormalizationCategorical
  );
  const [isWranglingProcess, setIsWranglingProcess] = useState(false);

  const columns = useMemo(
    () => formatColumns(currentData.keys),
    [dataTable.data[0]]
  );
  const dataSource = useMemo(
    () => formatDataSource(dataTable.data),
    [dataTable.data[0]]
  );

  function formatDataSource(dataSource) {
    // Insert keys
    const data = dataSource.map((item, index) => {
      return { ...item, key: index };
    });
    return data;
  }

  function formatColumns(keys) {
    const columns = [];
    for (let key of keys) {
      const _key = key.key;
      if (dataTable.data[0].hasOwnProperty(_key)) {
        columns.push({
          title: _key,
          dataIndex: _key,
          key: _key,
          ...getColumnOptionsProps(_key),
        });
      }
    }
    return columns;
  }

  function onDropColumnPress(dataIndex) {
    setSelectedColumn(dataIndex);
    setOpen(true);
  }

  function handlePopconfirmOk() {
    setConfirmLoading(true);
    if (selectedColumn === null) {
      return;
    }
    dropColumn(currentData._id, selectedColumn).then((res) => {
      setConfirmLoading(false);
      setOpen(false);
      setDataTable(res);
    });
  }

  function handlePopconfirmCancel() {
    setOpen(false);
  }

  function onSaveDataPress() {
    setIsLoading(true);
    saveData(currentData._id, currentData.fileType).then(() => {
      console.log("save data success");
      setIsLoading(false);
      setStep(1);
    });
  }

  function onDrawerOpen() {
    setIsDrawerOpen(true);
  }

  function onDrawerClose() {
    setIsDrawerOpen(false);
  }

  function onSummaryDrawerOpen() {
    setIsSummaryDrawerOpen(true);
  }

  function onSummaryDrawerClose() {
    setIsSummaryDrawerOpen(false);
  }

  function onSummaryPress(dataIndex) {
    summary(currentData._id, dataIndex).then((res) => {
      setSummaryData(res);
      onSummaryDrawerOpen();
    });
  }

  function getColumnOptionsProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={style.tableMoreOption}>
          <Flex direction="column">
            <Button
              icon={<PieChartOutlined />}
              block
              onClick={() => onSummaryPress(dataIndex)}
            >
              Summary
            </Button>
            <Spacer size={0.5} />
            <Button
              icon={<DeleteOutlined />}
              block
              danger
              onClick={() => onDropColumnPress(dataIndex)}
            >
              Drop
            </Button>
          </Flex>
        </div>
      ),
      filterIcon: (filtered) => <MoreOutlined />,
    };
  }

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  function findSelectOption(target, options) {
    for (let option of options) {
      if (option.value === target) {
        return option;
      }
    }
    return null;
  }

  function onFillingNANumericSelect(value) {
    setFillingNANumeric(value);
  }

  function onFillingNACategoricalSelect(value) {
    setFillingNACategorical(value);
  }

  function onNormalizationNumericSelect(value) {
    setNormalizationNumeric(value);
  }

  function onNormalizationCategoricalSelect(value) {
    setNormalizationCategorical(value);
  }

  function onWranglingProcessPress() {
    setIsWranglingProcess(true);
    wrangling(
      currentData._id,
      fillingNANumeric,
      fillingNACategorical,
      normalizationNumeric,
      normalizationCategorical
    ).then((res) => {
      setDataTable(res);
      setIsWranglingProcess(false);
      setIsDrawerOpen(false);
    });
  }

  function getNumericSummary(data) {
    return (
      <Flex direction="column" align="start">
        <div className={style.summaryContainer}>
          <Flex>
            <Typography.Text>Minimum value</Typography.Text>
            <Expanded />
            <Typography.Text>{data.min}</Typography.Text>
          </Flex>
        </div>
        <div className={style.summaryContainer}>
          <Flex>
            <Typography.Text>Maximum value</Typography.Text>
            <Expanded />
            <Typography.Text>{data.max}</Typography.Text>
          </Flex>
        </div>
        <div className={style.summaryContainer}>
          <Flex>
            <Typography.Text>Mean value</Typography.Text>
            <Expanded />
            <Typography.Text>{data.mean}</Typography.Text>
          </Flex>
        </div>
        <div className={style.summaryContainer}>
          <Flex>
            <Typography.Text>Standard deviation</Typography.Text>
            <Expanded />
            <Typography.Text>{data.std}</Typography.Text>
          </Flex>
        </div>
      </Flex>
    );
  }

  function getCategoricalSummary(data) {
    return (
      <Flex direction="column" justify="start">
        {data.unique.map((item, index) => (
          <div className={style.summaryContainer}>
            <Flex>
              <Typography.Text>Value: {item}</Typography.Text>
              <Expanded />
              <Typography.Text>Corresponding index: {index}</Typography.Text>
            </Flex>
          </div>
        ))}
      </Flex>
    );
  }

  function getSummaryContent() {
    if (summaryData === null) {
      return null;
    }
    if (summaryData.data.type === "numeric") {
      return getNumericSummary(summaryData.data);
    } else if (summaryData.data.type === "categorical") {
      return getCategoricalSummary(summaryData.data);
    }
  }

  function onNextStepPress() {
    setStep(1);
  }

  return (
    <div className={style.tableContainer}>
      <Flex direction="column" align="stretch">
        <Padding size={0}>
          <Flex align="center">
            <Typography.Title level={4}>
              {currentData.dataName}.{currentData.fileType}
            </Typography.Title>
            <Expanded />
            <Button type="primary" onClick={onDrawerOpen}>
              Data Wrangling
            </Button>
          </Flex>
        </Padding>
        <div className={style.tableStyle}>
          <Table
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            scroll={{ y: "50vh" }}
            pagination={{ position: [], pageSize: 20 }}
          />
        </div>
        <Padding size={1}>
          <Flex justify="flex-end">
            <Button onClick={onNextStepPress}>Next Step</Button>
            <Spacer size={0.5} />
            <Button
              type="primary"
              onClick={onSaveDataPress}
              loading={isLoading}
            >
              Save Data
            </Button>
          </Flex>
        </Padding>
      </Flex>
      <Modal
        title="Are you sure to drop this column?"
        open={open}
        onOk={handlePopconfirmOk}
        onCancel={handlePopconfirmCancel}
        confirmLoading={confirmLoading}
      >
        This action cannot be undone
      </Modal>
      <Drawer
        title="Data Wrangling"
        placement="right"
        width={500}
        open={isDrawerOpen}
        onClose={onDrawerClose}
      >
        <Typography.Title level={4}>Filling NA</Typography.Title>
        <div className={style.wranglingContainer}>
          <Flex>
            <Typography.Text>Numerical</Typography.Text>
            <Expanded />
            <Select
              defaultValue={fillingNANumeric}
              options={wranglingFillingNANumericOptions}
              onChange={onFillingNANumericSelect}
            />
          </Flex>
        </div>
        <div className={style.wranglingContainer}>
          <Flex>
            <Typography.Text>Categorical</Typography.Text>
            <Expanded />
            <Select
              defaultValue={fillingNACategorical}
              options={wranglingFillingNACategoricalOptions}
              onChange={onFillingNACategoricalSelect}
            />
          </Flex>
        </div>
        <Typography.Title level={4}>Normalization</Typography.Title>
        <div className={style.wranglingContainer}>
          <Flex>
            <Typography.Text>Numerical</Typography.Text>
            <Expanded />
            <Select
              defaultValue={normalizationNumeric}
              options={wranglingNormalizationNumericOptions}
              onChange={onNormalizationNumericSelect}
            />
          </Flex>
        </div>
        <div className={style.wranglingContainer}>
          <Flex>
            <Typography.Text>Categorical</Typography.Text>
            <Expanded />
            <Select
              defaultValue={normalizationCategorical}
              options={wranglingNormalizationCategoricalOptions}
              onChange={onNormalizationCategoricalSelect}
            />
          </Flex>
        </div>
        <Spacer size={1} />
        <Button
          size="large"
          type="primary"
          block
          loading={isWranglingProcess}
          onClick={onWranglingProcessPress}
        >
          Process
        </Button>
      </Drawer>
      <Drawer
        title={`Summary ${summaryData?.columnName}`}
        open={isSummaryDrawerOpen}
        onClose={onSummaryDrawerClose}
      >
        <Typography.Title level={4}>{getSummaryContent()}</Typography.Title>
      </Drawer>
    </div>
  );
}

export default DataTable;
