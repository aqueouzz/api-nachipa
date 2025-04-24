import User from '../models/User.js';

export const getAllUsers = async (req, res) => {

    const users = await User.find().select('-password -_id -token -confirmed')

    res.status(200).json({
        success :true,
        count : users.length,
        users
    })

}

export const getById = async (req, res) => {

    const {id} = req.params

    const user =  await User.findById(id).select('-password -_id -token -confirmed')

    if(!user){
        return res.status(404).json({
            success :false ,
            msg : 'User not found'
        })

    }

    res.status(200).json({
        success :true,
        user
    })

}

export const updateUser = async (req, res) => {

}

export const deleteUser = async (req, res) => {

}

