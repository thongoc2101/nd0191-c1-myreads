import "./App.css";
import { useEffect, useState } from "react";
import { getAll, search, update } from "./BooksAPI";
import { Link } from "react-router-dom";

function App() {
  const [allBookList, setAllBookList] = useState([]);

  const [showSearchPage, setShowSearchpage] = useState(false);
  const [currentlyReadingList, setCurrentlyReadingList] = useState([]);
  const [wantToReadList, setWantToReadList] = useState([]);
  const [readBookList, setReadBookList] = useState([]);

  const [searchBookList, setSearchBookList] = useState([]);

  useEffect(() => {
    getAllBooks();
  }, [])

  const getAllBooks = () => {
    getAll().then((res) => {
      // set all book list
      setAllBookList(res);

      setCurrentlyReadingList(res.filter((item) => item.shelf === 'currentlyReading'));
      setWantToReadList(res.filter((item) => item.shelf === 'wantToRead'));
      setReadBookList(res.filter((item) => item.shelf === 'read'));
    })
  }

  const searchBook = (e) => {
    if (e.target.value) {
      search(e.target?.value).then((res) => {
        res.forEach((item) => {
          const bookItem = allBookList.find((book) => book.id === item.id);

          if (bookItem) {
            item.shelf = bookItem.shelf;
          }
        })
        setSearchBookList(res);
      })
    }
  }

  const updateBook = (e, book) => {
    update(book, e.target.value).then((res) => {
      getAllBooks();
    })
  }

  const renderTemplateBookShelfChanger = (book) => {
    return (
      <div className="book-shelf-changer">
        <select onChange={(e) => updateBook(e, book)} value={book.shelf}>
          <option value="none" disabled>
            Move to...
          </option>
          <option value="currentlyReading" >
            Currently Reading
          </option>
          <option value="wantToRead" >Want to Read</option>
          <option value="read" >Read</option>
          <option value="none" >None</option>
        </select>
      </div>
    )
  }

  const handleClickAddABook = () => {
    setShowSearchpage(!showSearchPage)
    setSearchBookList([]);
  }

  return (
    <div className="app">
      {showSearchPage ? (
        <div className="search-books">
          <div className="search-books-bar">
            <Link
              to="/"
              className="close-search"
              onClick={() => setShowSearchpage(!showSearchPage)}
            >
              Close
            </Link>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
                onChange={(e) => searchBook(e)}
              />
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {
                searchBookList?.length > 0 && searchBookList.map((book) => {
                  return (
                    <li key={book?.id}>
                      <div className="book">
                        <div className="book-top">
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 193,
                              backgroundImage: `url(${book?.imageLinks?.thumbnail})`
                            }}
                          ></div>
                          {renderTemplateBookShelfChanger(book)}
                        </div>
                        <div className="book-title">{book?.title}</div>
                        <div className="book-authors">{book?.authors?.join(',')}</div>
                      </div>
                    </li>
                  )
                })
              }
            </ol>
          </div>
        </div>
      ) : (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Currently Reading</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {
                      currentlyReadingList.map((book) => {
                        return (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div
                                  className="book-cover"
                                  style={{
                                    width: 128,
                                    height: 193,
                                    backgroundImage: `url(${book.imageLinks?.thumbnail})`
                                  }}
                                ></div>
                                {renderTemplateBookShelfChanger(book)}
                              </div>
                              <div className="book-title">{book.title}</div>
                              <div className="book-authors">{book.authors.join(',')}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Want to Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {
                      wantToReadList.map((book) => {
                        return (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div
                                  className="book-cover"
                                  style={{
                                    width: 128,
                                    height: 193,
                                    backgroundImage: `url(${book.imageLinks?.thumbnail})`
                                  }}
                                ></div>
                                {renderTemplateBookShelfChanger(book)}
                              </div>
                              <div className="book-title">{book.title}</div>
                              <div className="book-authors">{book.authors.join(',')}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {
                      readBookList.map((book) => {
                        return (
                          <li key={book.id}>
                            <div className="book">
                              <div className="book-top">
                                <div
                                  className="book-cover"
                                  style={{
                                    width: 128,
                                    height: 192,
                                    backgroundImage: `url(${book.imageLinks?.thumbnail})`
                                  }}
                                ></div>
                                {renderTemplateBookShelfChanger(book)}
                              </div>
                              <div className="book-title">{book.title}</div>
                              <div className="book-authors">{book.authors.join(',')}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="open-search">
            <Link to="/search" onClick={() => handleClickAddABook()}>Add a book</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
