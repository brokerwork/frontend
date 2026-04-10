import DetailModal from './DetailModal';
import i18n from 'utils/i18n';
import cs from './PvmapSetting.less';
import PvmapForm, { PVMAP_FORM } from './PvmapForm';
import { Table as UiTable, Button, Icon, Message, Dialog } from 'lean-ui';
const { Td, Th } = UiTable;
import { PVMAP_HEADER } from '../../constant';
export default class PvmapSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.tableContainerRef = ref => (this.tableContainerDom = ref);
  }
  state = {
    editingItem: {},
    creating: false,
    showDetailModal: false,
    selectedSymbolGroup: null
  };
  componentDidMount() {
    const { clientWidth, clientHeight } = this.tableContainerDom;
  }
  showDetailModal = selected => {
    this.setState({
      showDetailModal: true,
      selectedSymbolGroup: selected
    });
  };

  closeDetailModal = () => {
    this.setState({
      showDetailModal: false
    });
  };

  edit = editingItem => {
    this.setState(
      {
        creating: false,
        editingItem: {}
      },
      () => {
        this.setState({
          editingItem: this.parseEditingItem(editingItem)
        });
      }
    );
  };

  create = () => {
    this.setState({
      editingItem: this.parseEditingItem({}),
      creating: true
    });
  };

  onCancel = () => {
    this.setState({
      editingItem: {},
      creating: false
    });
  };

  parseEditingItem = editingItem => {
    const { serverSymbols } = this.props;
    const result = {
      symbols: []
    };

    result.id = editingItem.id;
    result.canDelete =
      editingItem.canDelete === undefined ? 1 : editingItem.canDelete;
    result.pointValue = editingItem.pointValue;
    result.mapName = editingItem.mapName;
    result.pointValueGroup = {
      factor1: editingItem.factor1,
      variable1: editingItem.variable1 || 'contract_size',
      variable2Power: editingItem.variable2Power || '1',
      variable2: editingItem.variable2 || '1',
      variable3Power: editingItem.variable3Power || '1',
      variable3: editingItem.variable3 || '1'
    };

    serverSymbols.forEach(server => {
      result.symbols[server.serverId] = (
        (
          (editingItem.symbols || []).find(item => {
            return item.serverId === server.serverId;
          }) || {}
        ).symbols || []
      ).map(symbol => {
        return {
          label: symbol,
          value: symbol
        };
      });
    });

    return result;
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(PVMAP_FORM);
  };

  onSubmit = values => {
    const {
      createPVmap,
      updatePVmap,
      getPVmapList,
      serverSymbols
    } = this.props;
    const action = values.id ? updatePVmap : createPVmap;
    const data = {
      id: values.id,
      mapName: values.mapName,
      ...values.pointValueGroup,
      symbols: Object.keys(values.symbols).map(serverId => {
        return {
          serverId: serverId,
          symbols: values.symbols[serverId]
            .filter(symbol => {
              const currentServer =
                serverSymbols.find(server => server.serverId === serverId) ||
                {};

              return currentServer.symbols.includes(symbol.value);
            })
            .map(symbol => symbol.value)
        };
      })
    };

    action(data).then(({ result }) => {
      if (result) {
        Message.success(i18n['general.save_success']);
        this.onCancel();
        getPVmapList();
      }
    });
  };

  remove = ({ id }) => {
    const { showTipsModal, removePVmap, getPVmapList } = this.props;

    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        removePVmap(id).then(({ result }) => {
          if (result) {
            Message.success(i18n['general.remove_success']);
            getPVmapList();
          }
          cb();
        });
      }
    });
  };
  // 生成header的部分，排序和特殊处理的header
  renderHeadCell = ({ item, index, fixed }) => {
    return (
      <Th key={index} fixed={fixed}>
        {item.label}
      </Th>
    );
  };
  _renderTbody = () => {
    const { pvmapList, serverSymbols } = this.props;
    const { editingItem, creating } = this.state;
    return (
      <tbody>
        {pvmapList.map((pvmap, idx) => {
          const result =
            editingItem.id === pvmap.id ? (
              <PvmapForm
                key={idx}
                initialValues={editingItem}
                pvmapList={pvmapList}
                serverSymbols={serverSymbols}
                onCancel={this.onCancel}
                onSubmit={this.onSubmit}
                onSubmitClick={this.onSave}
              />
            ) : (
              <tr key={idx}>
                <Td>{pvmap.mapName}</Td>
                <Td>{pvmap.pointValue}</Td>
                <Td>
                  {pvmap.symbols.map((symbol, index) => {
                    return (
                      <a
                        key={index}
                        className={`${cs['list']} ${
                          index === 0 ? cs['first'] : ''
                        }`}
                        onClick={this.showDetailModal.bind(this, symbol)}
                      >
                        {pvmap.symbols.length === 1
                          ? ''
                          : `${symbol.serverName}: `}
                        {symbol.symbols.join(', ')}
                      </a>
                    );
                  })}
                </Td>
                <Td className={cs.operate_td}>
                  {/* <Button
                    type="primary"
                    icon="edit-outline"
                    size="small"
                    onClick={this.edit.bind(this, pvmap)}
                  /> */}
                  <Icon
                    icon="edit-outline"
                    className="main-color"
                    onClick={this.edit.bind(this, pvmap)}
                  />
                  {!!pvmap.canDelete ? (
                    // <Button
                    //   icon="delete-outline"
                    //   size="small"
                    //   className={cs['btn-left']}
                    //   onClick={this.remove.bind(this, pvmap)}
                    // />
                    <Icon
                      icon="delete-outline"
                      className="main-color"
                      onClick={this.remove.bind(this, pvmap)}
                    />
                  ) : (
                    undefined
                  )}
                </Td>
              </tr>
            );

          return result;
        })}
        {creating ? (
          <PvmapForm
            initialValues={editingItem}
            pvmapList={pvmapList}
            serverSymbols={serverSymbols}
            onCancel={this.onCancel}
            onSubmit={this.onSubmit}
            onSubmitClick={this.onSave}
          />
        ) : (
          undefined
        )}
      </tbody>
    );
  };

  render() {
    const { show, serverSymbols, onHide, pvmapList } = this.props;
    const { showDetailModal, selectedSymbolGroup } = this.state;
    return (
      <Dialog
        title={i18n['settings.rebate_setting.pvmap_setting']}
        visible={true}
        onCancel={onHide}
        className={cs['pvmap-modal']}
        footer={null}
      >
        <div className={cs['tips']}>
          {i18n['settings.rebate_setting.pvmap_setting.tips']}
        </div>
        <div ref={this.tableContainerRef} className={cs.table_container}>
          <UiTable
            data={pvmapList}
            columns={PVMAP_HEADER}
            className={cs.table_list}
            fixedHeader
            renderTbody={this._renderTbody}
            renderHeadCell={this.renderHeadCell}
          />
        </div>
        <div className={cs['actions-bar']}>
          {/* <div className={cs.create_btn} onClick={this.create}>
            <Icon icon="add-outline" />
            {i18n['settings.rebate_setting.add_pvmap_rule']}
          </div> */}
          <Button type="primary" onClick={this.create}>
            <Icon icon="add-outline" className="main-color" />
            {i18n['settings.rebate_setting.add_pvmap_rule']}
          </Button>
        </div>
        {showDetailModal ? (
          <DetailModal
            serverSymbols={serverSymbols}
            show={showDetailModal}
            onHide={this.closeDetailModal}
            data={selectedSymbolGroup}
          />
        ) : (
          undefined
        )}
      </Dialog>
    );
  }
}
