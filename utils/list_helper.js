const dummy = blogs => {
  return 1;
};

//use object destructuring {likes}
const totalLikes = blogs => blogs.reduce((sum, { likes }) => sum + likes, 0);

//Blog with most likes
const favoriteBlog = blogs => {
  const likesArray = blogs.map(({ likes }) => likes);
  const max = Math.max(...likesArray);
  const favBlog = blogs.find(({ likes }) => likes === max);
  return { title: favBlog.title, author: favBlog.author, likes: favBlog.likes };
};

//Author with most blogs
const mostBlog = blogs => {
  const sum = {};
  let check = 0;
  let highest;

  blogs.forEach((item, index) => {
    //gets the author name
    const author = blogs[index].author;
    if (sum[author] === undefined) {
      sum[author] = 1;
    } else {
      sum[author] = sum[author] + 1;
    }

    if (sum[author] > check) {
      highest = blogs[index];
      check++;
    }
  });
  return { author: highest.author, blogs: check };
};

//Author with most likes
const mostLikes = blogs => {
  const result = blogs.reduce((a, b) => {
    //determine if arthour exists in array
    let known = a.find(found => {
      return found.author === b.author;
    });

    //if not add it
    if (!known) {
      return a.concat({ author: b.author, likes: b.likes });
    }

    //if it does then increment likes value
    known.likes += b.likes;
    return a;
  }, []);
  console.log(result);
  return favoriteBlog(result);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes
};
