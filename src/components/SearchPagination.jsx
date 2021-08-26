import PropTypes from "prop-types";
import React from "react";
import { Pagination } from "react-bootstrap";

export class SearchPagination extends React.Component {
    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        query: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        hasResults : PropTypes.bool.isRequired,
        activePage : PropTypes.number.isRequired,
        totalNumHits : PropTypes.number,
        hitsPerPage : PropTypes.number.isRequired,
      };
      
    constructor(props) {
        super(props);
    }

    handleNextPage = (event) => {
        event.preventDefault();
        this.props.onSearch(this.props.source, this.props.query, event.target.id, this.props.hitsPerPage);
    };

    getPageArray(pageCount) {
        let pageArray = [];
        let currentPage = this.props.activePage;
        if (pageCount >= 1) {
            if (pageCount <= 9) {
              var i = 1;
              while (i <= pageCount) {
                pageArray.push(i);
                i++;
              }
            } else {
              if (currentPage <= 5) pageArray = [1, 2, 3, 4, 5, 6, 7, 8, "", pageCount];
              else if (pageCount - currentPage <= 4)
                pageArray = [
                  1,
                  "",
                  pageCount - 7,
                  pageCount - 6,
                  pageCount - 5,
                  pageCount - 4,
                  pageCount - 3,
                  pageCount - 2,
                  pageCount - 1,
                  pageCount
                ];
              else
                pageArray = [
                  1,
                  "",
                  currentPage - 3,
                  currentPage - 2,
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                  currentPage + 2,
                  currentPage + 3,
                  "",
                  pageCount
                ];
            }
          }
        return pageArray;
    }

    render() {
        let totalNum = (this.props.totalNumHits == null ? 0 : this.props.totalNumHits)
        let pageCount = Math.ceil(totalNum / this.props.hitsPerPage);
        let pageArray = this.getPageArray(pageCount, totalNum);
        
        return (
            <div>
            {this.props.hasResults || this.props.activePage > 1 ? 
            <Pagination style={{ justifyContent: "center" }}>
                {pageArray.map((ele, ind) => {
                let toReturn = [];
    
                if (ind === 0) {
                    toReturn.push(
                    <Pagination.First
                        key={"firstpage"}
                        id = {1}
                        onClick={this.handleNextPage}
                    />
                    );
                }
    
                if (ele === "") toReturn.push(<Pagination.Ellipsis key={ind} disabled={true}/>);
                else
                    toReturn.push(
                    <Pagination.Item
                        key={ind}
                        id={ele}
                        active={ele == this.props.activePage} 
                        onClick={this.handleNextPage}
                    >
                        {ele}
                    </Pagination.Item>
                    );
    
                if (ind === pageArray.length - 1) {
                    toReturn.push(
                    <Pagination.Last
                        key={"lastpage"}
                        id={pageCount}
                        onClick={this.handleNextPage}
                    />
                    );
                }
    
                return toReturn;
                },this)}
            </Pagination> 
            : (this.props.totalNumHits == 0 ? <p>No results found.</p> : null)
            }
            </div>
        );
    }
}