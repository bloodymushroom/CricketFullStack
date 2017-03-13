import mongoose, { Schema } from 'mongoose';
import moment from 'moment'

import BloodPressure from './bloodPressure'

const userSchema = new Schema({
  username: String,
  email: String,
  clientID: String,
  bloodPressures: [{
    type: Schema.Types.ObjectId,
    ref: 'BloodPressure'
  }]
})

// loop through collection of models and match IDs
let getQuery = function(model, instances, sortParams) {
  if (Array.isArray(instances)) {
    var result = model.find( {
      '_id': {
        $in: 
          instances.map((instance) => {
            console.log(instance);
            return mongoose.Types.ObjectId(instance)
          })
        
      }
    }).sort(sortParams);
    return sortParams? result.sort(sortParams) : result;
  } else {
    return model.find(instances._id)
  }
}

// return all the BPs for a user
userSchema.methods.getPressures = function() {
  return getQuery(BloodPressure, this.bloodPressures, { date: 1 })
}

// add a BP if it doesnt already exist
userSchema.methods.addBP = function(bloodPressure) {
  console.log('added bp')
  if (typeof bloodPressure === 'BloodPressure') {
    console.log('right type')
  }
  return this.update({
    $addToSet: {
      bloodPressures: bloodPressure
    }
  })
}

export { userSchema }

export default mongoose.model('User', userSchema)

