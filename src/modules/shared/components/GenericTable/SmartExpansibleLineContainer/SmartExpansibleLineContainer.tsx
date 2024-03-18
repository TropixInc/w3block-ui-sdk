interface SmartContainerProps {
  expansibleComponent: any;
  rowData: any;
  setOpenExpansible: (value: boolean) => void;
  setIsUpdateList?: (value: boolean) => void;
}

const SmartExpansibleLineContainer = ({
  expansibleComponent,
  rowData,
  setOpenExpansible,
  setIsUpdateList,
}: SmartContainerProps) => {
  const renderExpansibleComponent = () => {
    if (typeof expansibleComponent === 'function') {
      return expansibleComponent(rowData, setOpenExpansible, setIsUpdateList);
    } else if (typeof expansibleComponent === 'string') {
      return expansibleComponent;
    }
  };
  return <div>{renderExpansibleComponent()}</div>;
};

export default SmartExpansibleLineContainer;
