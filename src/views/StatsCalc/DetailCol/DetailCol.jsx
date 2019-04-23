//@flow
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { getDetails, getDamage } from 'appRedux/actions';
import { Button } from '@material-ui/core';
import { dungeonInfo } from 'data';
import Settings from './Settings';
import StatsDetail from './StatsDetail';
import DungeonSelect from './DungeonSelect';
import DungeonSettings from './DungeonSettings';
import DamageBar from './DamageBar';
import DamageDetail from './DamageDetail';

import {
  FilledInput,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
class DetailCol extends React.Component {
  state = {
    exHP: '',
    exDef: '',
    HP: '',
    def: '',
    open: true,
    dungeon: 'hmc',
  };

  static getDerivedStateFromProps(props, state) {
    const { adventurer } = props.stats;
    const { id, ex, EXHP0, EXDef0 } = adventurer || {};

    if ((EXHP0 || EXDef0) && (ex !== state.ex || id !== state.id)) {
      return {
        id,
        ex,
        exHP: adventurer['EXHP' + ex] || '',
        exDef: adventurer['EXDef' + ex] || '',
      };
    }

    return null;
  }

  render() {
    const { open, dungeon, ...res } = this.state;
    const { stats, halidom } = this.props;
    const cursor = open ? 'n-resize' : 's-resize';
    const title = stats.adventurer ? stats.adventurer.name : '';
    const details = getDetails(stats, halidom);
    const { max, min, textArea } = getDamage(
      stats,
      this.state,
      dungeonInfo[dungeon]
    );

    return (
      <Fragment>
        <Settings open={open} toggle={this.toggle} />
        <StatsDetail
          cursor={cursor}
          open={open}
          title={title}
          details={details}
        />

        {!open && (
          <Fragment>
            <DungeonSelect dungeon={dungeon} onChange={this.onChange} />
            <DungeonSettings onChange={this.onChange} {...res} />
            <DamageBar max={max} min={min} HP={details.total.HP} />
            <DamageDetail
              baseHP={details.total.HP}
              min={min}
              max={max}
              HP={this.state.HP}
              exHP={this.state.exHP}
              textArea={textArea}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }

  onClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  toggle = open => this.setState({ open });

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value });
}

const mapStateToProps = ({ stats, halidom }) => {
  return { stats, halidom };
};

export default connect(mapStateToProps)(DetailCol);
