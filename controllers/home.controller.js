exports.home = async (req, res) => {
    try {
        res.render('pages/home', {
            current : "home",
            user: req.session.user
        });
    } catch (err) {
        this.next(err);
    }
};


