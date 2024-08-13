const User = require('../models/user');

exports.getLeaderBoard = async (req, res) => {

    try {

        const leaderBoard = await User.findAll({
            attributes: ['id', 'name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']],
            limit: 10
        });

        res.status(200).json(leaderBoard);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({success:false});
    }

}

