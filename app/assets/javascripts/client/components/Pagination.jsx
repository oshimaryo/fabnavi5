import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';

export default class Pagination extends Component {

    // pagination's function when user is clicked
  onHandlePageClick(){
    console.log('yey');
  }

    render(){
        return(
            <div>
                <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={10}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.onHandlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
            </div>
        );
    }
}
