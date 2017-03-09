import React, {Component, PropTypes , cloneElement} from 'react';
import {connect} from 'react-redux';


// pagination update version
export default class Pagination extends Component {

    constructor(props){
        super(props);
        // // state 定義
        this.state = {
            currentPage: 1,
            pageCount: 0
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data.length === 0){
            return;
        }
        console.log('---- called componentWillReceiveProps() ---');
        console.log('nextProps');
        console.dir(nextProps);
        const data = nextProps.data;
        const startingPage = this.props.startingPage
            ? this.props.startingPage
            : 1;
        const pageSize = this.props.pageSize;
        let pageCount = parseInt(data.length / pageSize);
        if(data.length % pageSize > 0){
            pageCount++;
        }
        this.setState({
            currentPage: startingPage,
            pageCount: pageCount
        });
    }


    setCurrentPage(num){
        this.setState({currentPage: num});
    }

    createControls(){
        console.log('clicked !!!!');
        let controls = [];
        const pageCount = this.state.pageCount;
        for(let i = 1; i <= pageCount; i++){
            const baseClassName = 'pagination-controls__button';
            const activeClassName = i === this.state.currentPage ? `${baseClassName}--active` : '';
            controls.push(
                <div key={i}
                    className={`${baseClassName} ${activeClassName}`}
                    onClick={() => this.setCurrentPage(i)}
                >
                {i}
                </div>
            );
        }
        return controls;
    }

    createPaginateData(){
        const data = this.props.data;
        console.log('propsの中身');
        console.dir(this.props.data);
        const pageSize = this.props.pageSize;
        const currentPage = this.state.currentPage;
        const upperLimit = currentPage * pageSize;
        const dataSlice = data.slice((upperLimit - pageSize), upperLimit);
        console.log('dataSlice');
        console.dir(dataSlice);
        return dataSlice;
    }

    render(){
        // this.makingProps(this.props.data)
        if(this.props.data.length === 0){
            return (
                <div>
                    <p> Just Moment Please</p>
                </div>
            )
        } else {
            // これでpropsに全てのproject要素が入るようになった
            console.log('------- receive props -------');
            console.dir(this.props);// selectorも来ている
            console.dir(this.state);
            // childrenに渡すのはthis.props内のdataでおｋ？
            return(
            <div>
                <div className="procon">
                    {this.createControls()}
                </div>
                <div className="proconcon">
                    {cloneElement(this.props.children, {data: this.createPaginateData(), selector: this.props.selector})}
                </div>
            </div>
        )
        }

    }
}

/**
 <div className='pagination'>
                <div className='pagination-controls'>
                    {this.createControls()}
            </div>
            <div className='pagination-results'>
                {cloneElement(this.props.children, {data: this.createPaginateData()})}
            </div>
            </div>
 */

Pagination.defaultProps = {
    pageSize: 8,// 要素数
    startingPage: 1
};

// function mapStateToProps(state) {
//   return {
//     isFetching: state.manager.isFetching,
//     projects: state.manager.projects,
//     selector: state.manager.selector
//   };
// }

// // 上記三種が渡される
// export default connect(mapStateToProps)(UpdatePagination);
