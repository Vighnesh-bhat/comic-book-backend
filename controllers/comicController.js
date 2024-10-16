const db = require('../config/db');


// Create a new comic book
exports.createBook = async (req, res) => {
  const { name, author, year, price, pages, condition, description = null } = req.body;
  
  // Setting discount to 0 if not provided or empty
  const discount = req.body.discount ? req.body.discount : 0;
  
  try {
    const [result] = await db.query(
      'INSERT INTO comics (name, author, year, price, discount, pages, `condition`, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, author, year, price, discount, pages, condition, description]
    );
    res.status(201).json({ id: result.insertId, ...req.body, discount });  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Update a comic book
exports.updateBook = async (req, res) => {
  const comicId = req.params.id; // Getting comic ID from the URL
  const { name, author, year, price, discount, pages, condition, description } = req.body;

  try {
    // Checking if the comic exists
    const [existingComic] = await db.query('SELECT * FROM comics WHERE id = ?', [comicId]);
    
    if (!existingComic.length) {
      return res.status(404).json({ error: 'Comic book not found' });
    }

    // Only updating fields provided in the request body)
    const updatedFields = {
      name: name || existingComic[0].name,
      author: author || existingComic[0].author,
      year: year || existingComic[0].year,
      price: price || existingComic[0].price,
      discount: discount === undefined ? existingComic[0].discount : discount, // Discount can be 0, so use undefined check
      pages: pages || existingComic[0].pages,
      condition: condition || existingComic[0].condition,
      description: description || existingComic[0].description,
    };

    // Updating the comic book in the database
    const [result] = await db.query(
      'UPDATE comics SET name = ?, author = ?, year = ?, price = ?, discount = ?, pages = ?, `condition` = ?, description = ? WHERE id = ?',
      [updatedFields.name, updatedFields.author, updatedFields.year, updatedFields.price, updatedFields.discount, updatedFields.pages, updatedFields.condition, updatedFields.description, comicId]
    );


    res.status(200).json({ message: 'Comic book updated successfully', updatedComic: updatedFields });

  } catch (error) {
 
    res.status(500).json({ error: error.message });
  }
};


// Delete a comic book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the comic exists before deleting
    const [existingComic] = await db.query('SELECT * FROM comics WHERE id = ?', [id]);

    if (!existingComic.length) {
      return res.status(404).json({ error: 'Comic book not found' });
    }

    // Deleting the comic from the database
    await db.query('DELETE FROM comics WHERE id = ?', [id]);

    res.status(200).json({ message: 'Comic deleted successfully' });
  } catch (error) {
  
    res.status(500).json({ error: error.message });
  }
};






// Get comic by ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    // Query to fetch the comic book by its ID
    const [rows] = await db.query('SELECT * FROM comics WHERE id = ?', [id]);
    
    // Check if the comic book exists
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Comic not found' });
    }

    // Return the comic book details
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all comics
// Controller function to fetch comics with pagination, filtering, and sorting
exports.getAllBooks = async (req, res) => {
  const { page = 1, limit = 10, author, year, price, condition, sortBy = 'name', order = 'asc' } = req.query;

  // Constructing the WHERE clause for filtering
  let whereClauses = [];
  let queryParams = [];

  if (author) {
    whereClauses.push('author = ?');
    queryParams.push(author);
  }
  if (year) {
    whereClauses.push('year = ?');
    queryParams.push(year);
  }
  if (price) {
    whereClauses.push('price = ?');
    queryParams.push(price);
  }
  if (condition) {
    whereClauses.push('`condition` = ?');
    queryParams.push(condition);
  }

  // Build the base query with filtering
  let query = 'SELECT * FROM comics';
  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  // Add sorting to the query
  query += ` ORDER BY ${sortBy} ${order === 'desc' ? 'DESC' : 'ASC'}`;

  // Add pagination to the query
  const offset = (page - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  try {
    // Executing the query with pagination, filtering, and sorting
    const [rows] = await db.query(query, queryParams);

    // Count total comics for pagination purposes
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM comics');
    const totalComics = countResult[0].total;

    res.json({
      totalComics,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalComics / limit),
      comics: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};