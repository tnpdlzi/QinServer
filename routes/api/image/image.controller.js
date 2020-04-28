exports.get = (req, res) => {

    let image = req.query.image;
    res.send(image);
}

