import axios from "axios";
import React, { useEffect, useState } from "react";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://acowale-news-backend.onrender.com/news", {
          params: { query: "latest", language: "en", page: 1 },
        });
        if (response.data.articles && response.data.articles.length > 0) {
          setArticles(response.data.articles);
          setFilteredArticles(response.data.articles);
        } else {
          console.error("No articles found in the response");
        }
      } catch (error) {
        console.error("Error fetching the news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  // Filter articles based on search term
  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchTerm, articles]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Get current page articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 to-pink-100 p-8">
      <h1 className="text-5xl font-bold text-center text-white mb-10">News</h1>

      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search here..."
          className="border-2 p-4 rounded-lg shadow-lg w-full sm:w-1/2 focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
        />
      </div>

      {loading ? ( // Show loader while loading
        <div className="flex justify-center items-center">
          <div className="loader">
            {" "}
            {/* Loader */}
            <div className="w-16 h-16 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentArticles.length > 0 ? (
            currentArticles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-gray-900 hover:text-purple-500 transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{article.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    <b>Source:</b>{" "}
                    <a
                      href={article.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 underline hover:text-purple-700"
                    >
                      {article.source.name}
                    </a>
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300 transition-transform duration-300 transform hover:scale-105"
                  >
                    Read more
                  </a>
                  <p className="text-sm text-gray-500 mt-4">
                    <b>Published at:</b>{" "}
                    {new Date(article.publishedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-lg">
              No articles found for the search term "{searchTerm}"
            </p>
          )}
        </div>
      )}

     {/* Pagination */}
{filteredArticles.length > 0 && !loading && (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 mt-8">
    <button
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-full ${
        currentPage === 1
          ? "bg-gray-300"
          : "bg-purple-500 text-white hover:bg-purple-600"
      } transition-transform duration-300 transform hover:scale-105`}
    >
      Previous
    </button>
    <span className="text-lg text-white font-semibold text-center sm:text-left">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-full ${
        currentPage === totalPages
          ? "bg-gray-300"
          : "bg-purple-500 text-white hover:bg-purple-600"
      } transition-transform duration-300 transform hover:scale-105`}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default News;
