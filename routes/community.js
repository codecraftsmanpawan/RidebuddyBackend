const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken');
const { CommunityPost } = require('../controllers/community/postInCommunity.js');
const { likePost } = require('../controllers/community/likeCommunityPost.js');
const { updatePostById } = require('../controllers/community/updatePosteById.js');
const { getCommunityPosts } = require('../controllers/community/getAllCommunityPosts.js')
const {sendOtp,verifyOtp} = require('../controllers/community/organizationVerification.js');
const {addOrganization,getOrganizations} = require('../controllers/community/addOrganization.js');
const { deletePostById } = require('../controllers/community/deletePost.js');
const { reportOnPost } = require('../controllers/community/reportOnPost.js');
const { getUserPosts } = require('../controllers/community/getPostsByUserId.js');
const {organizationPost}=require('../controllers/community/verifyOrganization.js');
router.post('/community-post', authenticateToken, (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            } else {
                return res.status(500).json({ error: 'An unknown error occurred.' });
            }
        }
        CommunityPost(req, res);
    });
});

router.post('/community/like-post/:id',  likePost); // Route to like feedback community post
router.get('/community/all-posts', getCommunityPosts); // Route to like feedback community post
router.put('/community/update-post/:id', authenticateToken, updatePostById);
router.post('/organization/verify-otp', verifyOtp); // Route to like feedback community post
router.post('/organization/send-otp', sendOtp);
router.post('/organization/addorg', addOrganization);
router.get('/organization/getorg',  getOrganizations);
router.delete('/community/delete-post/:id',  deletePostById)
router.patch('/community/report-post/:id',  reportOnPost)
router.get('/community/posts/:id',  getUserPosts);
router.get('/organization/org-verify',  organizationPost);

module.exports = router;
