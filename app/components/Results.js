import React from 'react'
import { battle } from '../utils/api'
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/fa'
import PropTypes from 'prop-types'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function ProfileList ({ profile }) {
  return (
    <ul className='card-list'>
      <li>
        <FaUser color='rgb(239, 115, 115)' size={22} />
        {profile.name}
      </li>
      {profile.location && <li>
        <Tooltip text="User's location">
          <FaCompass size={22} color='rgb(144, 116, 255)'/>
          {profile.location}
        </Tooltip>
      </li>}
      {profile.company && <li>
        <Tooltip text="User's company">
          <FaBriefcase size={22} color='#795548'/>
          {profile.company}
        </Tooltip>
      </li>}
      <li>
        <FaUsers color='rgb(129, 195, 245)' size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <FaUserFriends color='rgb(64, 183, 95)' size={22} />
        {profile.following.toLocaleString()} following
      </li>
      <li>
        <FaCode color='rgb(59, 76, 85)' size={22} />
        {profile.public_repos.toLocaleString()} repositories
      </li>
    </ul>
  )
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
}

export default class Results extends React.Component {
  constructor(props) {
    super(props)

     this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    }
  }
  componentDidMount() {
    const { playerOne, playerTwo } = this.props

     battle([ playerOne, playerTwo ])
      .then((players) => {
        this.setState({
          error: null,
          winner: players[0],
          loser: players[1],
          loading: false
        })
    }).catch(({ message }) => {
        this.setState({
          error: message,
          loading: false
        })
    })
  }
  render() {
    const { winner, loser, error, loading } = this.state

    if (loading === true) {
      return <Loading text='Battling' />
    }

    if (error) {
      return (
        <p className='center-text error'>{error}</p>
      )
    }

    return (
      <React.Fragment>
        <div className='grid space-around container-sm'>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Winner'}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            name={winner.profile.login}
            avatar={winner.profile.avatar_url}
            href={winner.profile.html_url}
          >
            <ProfileList profile={winner.profile} />
          </Card>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Loser'}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            name={loser.profile.login}
            avatar={loser.profile.avatar_url}
            href={loser.profile.html_url}
          >
             <ProfileList profile={loser.profile} />
          </Card>
        </div>
        <button
          className='btn dark-btn btn-space'
          onClick={this.props.onReset}
        >
          Reset
        </button>
      </React.Fragment>
    )
  }
}

Results.propTypes = {
  onReset: PropTypes.func.isRequired
}