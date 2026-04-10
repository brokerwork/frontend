import { CustomerPropertiesDTO as Customer } from '../model/customer';
import { ActionTypes } from './actionTypes';
import {
	SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport,
	FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget'

/* common table actions */
function toggleItem(id, isSelected) {
	return {
		type: ActionTypes.TOGGLE_TABLE_ITEM,
		payload: { id: id, selected: isSelected }
	}
}
function toggleAllItems(ids: Array<string>, isSelected) {
	return {
		type: ActionTypes.TOGGLE_TABLE_ALL_ITEMS,
		payload: { ids: ids, selected: isSelected }
	}
}
export { toggleItem, toggleAllItems }