import PureRenderComponent from '../../core/PureRenderComponent';

export default class DaoHangCategory extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.getCategoryList({type:1});
    }

    renderItemList(){
        const {user, actions,category} = this.props;
        var itemList = category.items || [];
        var resultList = [];
        itemList.forEach(function(item,i){
            resultList.push (
                <a href={item.get("link")} >
                    {item.get("text")}
                </a>
            );
        });
        return resultList;
    }

    render() {
        const {user, actions,category} = this.props;
        return (
            <div>
                <h2>{category.get('text')}</h2>
                <div>{this.renderItemList()}</div>
            </div>
        );
    }
}