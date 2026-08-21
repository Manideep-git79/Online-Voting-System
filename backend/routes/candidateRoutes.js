const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware } = require('../jwt');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);

        if (user && user.role === 'admin') {
            return true;
        }

        return false;
    } catch (err) {
        return false;
    }
};

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const data = req.body;

        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();

        console.log('candidate data saved');

        res.status(201).json({
            response: response
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const candidateID = req.params.candidateID;

        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(
            candidateID,
            updatedCandidateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!response) {
            return res.status(404).json({
                error: 'Candidate not found'
            });
        }

        console.log('candidate data updated');

        res.status(200).json(response);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                message: 'User does not have admin role'
            });
        }

        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({
                error: 'Candidate not found'
            });
        }

        console.log('candidate deleted');

        res.status(200).json(response);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        const userId = req.user.id;

        const candidate = await Candidate.findById(candidateID);

        if (!candidate) {
            return res.status(404).json({
                message: 'Candidate not found'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                message: 'Admin is not allowed to vote'
            });
        }

        if (user.isVoted) {
            return res.status(400).json({
                message: 'You have already voted'
            });
        }

        candidate.votes.push({
            user: userId
        });

        candidate.voteCount++;

        await candidate.save();

        user.isVoted = true;

        await user.save();

        return res.status(200).json({
            message: 'Vote recorded successfully'
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.get('/vote/count', jwtAuthMiddleware, async (req, res) => {
    try {
        const candidates = await Candidate.find()
            .sort({ voteCount: -1 });

        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            };
        });

        return res.status(200).json(voteRecord);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.get('/',jwtAuthMiddleware,async (req, res) => {
    try {
        const candidates = await Candidate.find(
            {},
            'name party'
        );

        res.status(200).json(candidates);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;