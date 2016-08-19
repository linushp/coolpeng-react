import $ from 'jquery';
import {loadStaticJS,loadStaticCSS,createUUID,uniqueId,EventBus,isEventInTarget,_undefined,isFunction,shallowEqual} from '../../core/utils/index';
import {toPagination} from './Pagination';
import './index.less';


//function test(){
//    //    private int pageSize;
//    //private int pageNo;
//    //private int totalCount;
//    <ReactPagination pageNo="" totalCount="" pageSize="" onClickPagination={fun}></ReactPagination>
//}

var EVENT_DOCUMENT_CLICK = 'EVENT_DOCUMENT_CLICK';

var ReactPaginationPn = "ReactPaginationPn";

function getEventReactPaginationPn(evt) {
    var $target = $(evt.target);
    if ($target.hasClass(ReactPaginationPn)) {
        var pn =  $target.attr('pn');
        try {
            return window.parseInt(pn,10);
        }catch(e) {
        }
    }
    return _undefined;
}


export function shallowCompare(component, nextProps, nextState) {
    return !shallowEqual(component.props, nextProps) || !shallowEqual(component.state, nextState);
}


export default class ReactPagination extends React.Component {

    constructor(props) {
        super(props);
        this.uniqueId = uniqueId('ReactPaginationUniqueId');
        this.documentClickListener = this.documentClickListener0.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
         return shallowCompare(this, nextProps, nextState);
    }

    componentDidMount() {
        EventBus.addEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener)
    }

    componentWillUnmount() {
        EventBus.removeEventListener(EVENT_DOCUMENT_CLICK, this.documentClickListener);
    }

    documentClickListener0(evt, self) {
        if (isEventInTarget(evt, this.uniqueId)) {
            var pn = getEventReactPaginationPn(evt);
            if (pn !== _undefined) {
                //点击到
                var onClickPagination = this.props.onClickPagination;
                if (isFunction(onClickPagination)) {
                    onClickPagination(pn);
                }
            }
        }
    }

    render() {
        var content = toPagination({
            pageNumber: this.props.pageNo,
            recordCount: this.props.totalCount,
            pageSize:this.props.pageSize,
            linkRender: function (p) {
                return "<a pn='" + p + "' class='" + ReactPaginationPn + "'>" + p + "</a>"
            }
        });
        return (<div ref="dom" id={this.uniqueId} dangerouslySetInnerHTML={{__html:content}}></div>);
    }
}


