import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';

export default class Pagination extends Component {
    // pagination's function when user is clicked
  onHandlePageClick(){
    console.log('yey');
  }
    render(){
        return(
            <ReactPaginate previousLabel={"prev"}
                   nextLabel={"next"}

                   breakClassName={"break-me"}
                   pageCount={20}
                   marginPagesDisplayed={3}
                   pageRangeDisplayed={3}
                   onPageChange={this.onHandlePageClick}
                   containerClassName={"pagination"}
                   subContainerClassName={"pages pagination"}
                   activeClassName={"active"} />
        );
    }
}
