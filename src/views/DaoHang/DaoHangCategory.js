import PureRenderComponent from '../../core/PureRenderComponent';

export default class DaoHangCategory extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.getCategoryList({type:1});
    }

    deleteItem(item,i){
        const {actions} = this.props;
        console.log(item.get('id'));
        actions.deleteDhItem(item.toJS());
    }

    deleteDhCategory(category){
        const {actions} = this.props;
        actions.deleteDhCategory(category.toJS());
    }

    renderItemList(){
        var that = this;
        const {user, actions,category} = this.props;
        var itemList = category.get('items');
        var resultList = [];
        if(itemList){
            itemList.forEach(function(item,i){
                resultList.push (
                    <div>
                    <a href={item.get("link")} >
                        {item.get("text")}
                    </a>
                        <button onClick={that.deleteItem.bind(that,item,i)}> 删除</button>
                    </div>
                );
            });
        }
        return resultList;
    }

    render() {
        const {user, actions,category} = this.props;
        var that = this;
        return (
            <div>
                <h2>{category.get('text')}---{category.get('id')}
                    <button onClick={that.deleteDhCategory.bind(that,category)}> 删除</button>
                </h2>
                <div>{this.renderItemList()}</div>
            </div>
        );
    }
}