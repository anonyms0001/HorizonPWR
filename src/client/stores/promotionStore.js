import { store } from '../framework'

export default store({

    proposedPromotion: [],

    eventListeners: {
        SelectedRepToPromote({ selectedNewPositon, userToPromoteFirstName, userToPromote }) {
            // console.log(userId, firstName, newPosition)
            this.proposedPromotion = [selectedNewPositon, userToPromoteFirstName, userToPromote]
        }
    }
})
