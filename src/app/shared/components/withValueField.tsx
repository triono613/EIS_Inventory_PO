import * as React from 'react'
import {
    DropDownList,
    ComboBox,
    ComboBoxProps,
    DropDownListProps,
    DropDownListBlurEvent,
    ComboBoxBlurEvent,
    DropDownListFocusEvent,
    ComboBoxFocusEvent,
    DropDownListChangeEvent,
    ComboBoxChangeEvent,
    ComboBoxPageChangeEvent,
    DropDownListPageChangeEvent,
    ComboBoxFilterChangeEvent,
    DropDownListFilterChangeEvent,
} from '@progress/kendo-react-dropdowns'

interface WithValueFieldProp {
    valueField?: string
}

// provide and indexing type so that in triggerEvent() on ln 66 & 67
// TypeScript compiler doesn't throw an error at us
interface IndexSignature {
    [key: string]: any
}

const isPresent = (value: any) => value !== null && value !== undefined

/**
 * There was a breaking change for v2.0.0 (2018-09-12) in the kendo-ui-react
 * component library for DropDownList and ComboBox components.
 * This change saw the removal of the 'valueField' prop which I was using before
 * the breaking change. They provided a HOC example to add the functionality
 * back in. I got it working for TypeScript.
 *
 * @example const DropDownListWithValueField = withValueField<DropDownList>(DropDownList);
 *
 * @see https://www.telerik.com/kendo-react-ui/components/changelogs/ui-for-react/#release-12856530
 * @see https://www.telerik.com/kendo-react-ui/components/dropdowns/dropdownlist/common-scenarios/#toc-using-data-fields-for-values
 */
export function withValueField<T = DropDownList>(WrappedDropdownComponent: React.ComponentType) {
    type DropdownComponentType = T extends DropDownList ? typeof DropDownList : typeof ComboBox

    type Props = T extends DropDownList
        ? DropDownListProps & WithValueFieldProp & IndexSignature
        : ComboBoxProps & WithValueFieldProp & IndexSignature

    type BlurEvent = T extends DropDownList ? DropDownListBlurEvent : ComboBoxBlurEvent
    type FocusEvent = T extends DropDownList ? DropDownListFocusEvent : ComboBoxFocusEvent
    type ChangeEvent = T extends DropDownList ? DropDownListChangeEvent : ComboBoxChangeEvent
    type PageChangeEvent = T extends DropDownList
        ? DropDownListPageChangeEvent
        : ComboBoxPageChangeEvent
    type FilterChangeEvent = T extends DropDownList
        ? DropDownListFilterChangeEvent
        : ComboBoxFilterChangeEvent
    type EventType = BlurEvent | FocusEvent | ChangeEvent | PageChangeEvent | FilterChangeEvent

    return class DropdownComponentWithValueField extends React.Component<Props> {
        public componentRef = React.createRef<DropdownComponentType>()
        public events: object = {
            onBlur: (event: BlurEvent) => this.triggerEvent('onBlur', event),
            onFocus: (event: FocusEvent) => this.triggerEvent('onFocus', event),
            onChange: (event: ChangeEvent) => {
                console.log('onChange() event=', event);
                if (event.value) event.value = event.value[this.props.valueField]
                console.log('onChange() final event=', event)
                this.triggerEvent('onChange', event)
            },
            onPageChange: (event: PageChangeEvent) => this.triggerEvent('onPageChange', event),
            onFilterChange: (event: FilterChangeEvent) =>
                this.triggerEvent('onFilterChange', event),
        }

        get value() {
            if (this.componentRef) {
                // we cast to any because TypeScript cannot infer that the value property will
                // exist at runtime. This is one of the few cases where we as a developer have
                // to override TypeScript since we know the property will exist no matter what.
                const value = (this.componentRef as any).value
                return isPresent(value) ? value[this.props.valueField] : value
            }
        }

        public triggerEvent = (eventType: string, event: EventType) => {
            if (this.props[eventType]) {
                this.props[eventType].call(undefined, {
                    ...event,
                    target: this,
                })
            }
        }

        public itemFromValue = (value: any) => {
            const {data = [], valueField} = this.props
            return isPresent(value) ? data.find((item: any) => item[valueField] === value) : value
        }

        public render() {
            console.log('value = ', this.props.value);
            //console.log('defaultValue = ', this.props.defaultValue);
            return (
                <WrappedDropdownComponent
                    {...this.props}
                    value={this.itemFromValue(this.props.value)}
                    defaultValue={this.itemFromValue(this.props.defaultValue)}
                    ref={this.componentRef}
                    {...this.events}
                />
            )
        }
    }
}

