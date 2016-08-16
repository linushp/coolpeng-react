import PureRenderComponent from '../../core/PureRenderComponent';
import {isAdmin,displayControl} from '../../core/utils';

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

    editItem(item,i){

    }


    deleteDhCategory(category){
        const {actions,parent} = this.props;
        actions.deleteDhCategory(category.toJS(),function () {
            parent.refreshCategoryList()
        });
    }


    editDhCategory(category){

    }

    addCategoryItem(category){

    }


    renderItemList(category,adminControl){
        var that = this;
        var itemList = category.get('items');
        var resultList = [];
        if(itemList){
            itemList.forEach(function(item,i){
                resultList.push (
                    <div className="cp-daohang-aa">
                        <a href={item.get("link")} target="_blank">{item.get("text")}</a>
                        {adminControl(
                            <span>
                                <button className="del" onClick={that.deleteItem.bind(that,item,i)}> 删除</button>
                                <button className="edit" onClick={that.editItem.bind(that,item,i)}> 编辑</button>
                            </span>
                        )}
                    </div>
                );
            });
        }
        return resultList;
    }

    render() {
        const {user, actions,category} = this.props;
        var isAdminUser = isAdmin(user);
        var adminControl = displayControl.bind(this,isAdminUser);

        var that = this;
        return (
            <div className="cp-daohang-cc">
                <h2>
                    <span>{category.get('text')}</span>
                    {adminControl(
                        <span>
                            <button onClick={that.deleteDhCategory.bind(that,category)}> 删除</button>
                            <button onClick={that.editDhCategory.bind(that,category)}> 编辑</button>
                            <button onClick={that.addCategoryItem.bind(that,category)}> 添加链接</button>
                        </span>)
                    }
                </h2>
                <div className="cp-daohang-link">
                    {this.renderItemList(category,adminControl)}
                </div>
            </div>
        );
    }
}