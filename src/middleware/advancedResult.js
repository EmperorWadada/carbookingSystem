const advancedResult = (model, populate) => async(req, res, next) => {

    const reqQuery = {...req.query};
    
    // Remove mongoose operator as fields
    const removeFields = ['limit', 'select', 'page', 'sort'];
    removeFields.forEach(params => delete reqQuery[params]);

    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|eq|in|or)\b/, matchedOperator => `$${matchedOperator}`);

    let queryBuilder = model.find(JSON.parse(queryString));

    if (populate) {
        queryBuilder.pupulate(pupulate)
    }

    if (req.query.select) {
        const selectFields = req.query.select.split(",").join(" ");
        queryBuilder = queryBuilder.select(selectFields)
    }

    if (req.query.sort) {
        const sortFields = req.query.sort.split(",").join(" ")
        queryBuilder = queryBuilder.sort(sortFields)
    }

    // pagination
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const totalDoc = await model.countDocuments();
    
    queryBuilder = queryBuilder.skip(startIndex).limit(limit);
    const result = await queryBuilder;

    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        };
    }

    if (endIndex < totalDoc) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    res.advancedResult = {
        success: true,
        count: result.length,
        pagination,
        data: result
    };
        
    next();
}

module.exports = advancedResult;