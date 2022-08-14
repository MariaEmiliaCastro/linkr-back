import Joi from "joi";

const validateTimelinePostSchema = Joi.object().keys({
    userId: Joi.number().required(),
    userImage: Joi.string().uri().required(),
    username: Joi.string().min(3).required(),
    description: Joi.string().min(0),
    link: Joi.string().uri().required()
});

export default validateTimelinePostSchema;