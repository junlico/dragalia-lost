import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { updateItem } from 'actions';
import { getItemFields, getLimit, useEvent } from 'utils';
import SelectItem from './SelectItem';

function Item({ focused, fields, item, updateItem }) {
  const { level, bond, curRarity, rarity, unbind } = item || {};

  const timeRef = useRef();

  const changeInput = e => {
    const { name, value } = e.target;
    const key1 = name === 'level' ? focused : name;
    const r = focused === 'adventurer' ? curRarity : rarity;

    const max = getLimit(key1, r, unbind);
    const val = value > max ? max : value;
    if (item[name] === val) return;
    updateItem({ itemKey: focused, updates: { [name]: val } });
  };

  const getUpdates = (key, value) => {
    if (item[key] === value) return null;
    let updates = { [key]: value };

    switch (key) {
      case 'curRarity': {
        const level = getLimit(focused, value);
        updates = {
          ...updates,
          level,
          mana: getLimit('mana', value),
          ex: value === '5' ? '4' : '0',
        };

        break;
      }
      case 'mana':
        updates.ex = value === '50' ? '4' : '0';
        break;
      case 'ex':
        updates = {
          ...updates,
          curRarity: '5',
          mana: '45',
          level: getLimit(focused, '5'),
        };
        break;
      case 'unbind': {
        const level = getLimit(focused, rarity, value);
        updates.level = level;
        break;
      }
      default:
        break;
    }

    return updates;
  };

  const handleChange = useEvent(({ name, value }) => {
    const updates = getUpdates(name, value);
    if (updates === null) return;
    updateItem({ itemKey: focused, updates });
  });

  useEffect(() => {
    clearTimeout(timeRef.current);
    let key;
    if (level === '') {
      key = 'level';
    } else if (bond === '') {
      key = 'bond';
    }

    if (key !== undefined) {
      timeRef.current = setTimeout(() => {
        updateItem({ itemKey: focused, updates: { [key]: 1 } });
      }, 1000);
    }
  }, [level, bond, focused, updateItem]);

  if (item === null) return null;

  return (
    <div className="grid-2">
      {fields.map(key => {
        const { [key]: value = '' } = item;

        if (
          key === 'curRarity' ||
          key === 'unbind' ||
          key === 'mana' ||
          key === 'ex'
        ) {
          let r;
          if (key === 'curRarity') {
            r = rarity;
          } else if (key === 'mana') {
            r = curRarity;
          }

          return (
            <div key={key}>
              {key}
              <SelectItem
                key={key}
                name={key}
                value={value}
                rarity={r}
                onChange={handleChange}
              />
            </div>
          );
        }

        return (
          <div key={key}>
            {key}
            <div className="flex">
              <input
                type="number"
                value={value}
                name={key}
                onChange={changeInput}
              />
              {(key === 'augHp' || key === 'augStr') && (
                <button type="button" className="input-btn" name={key}>
                  max
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const mapStateToProps = state => {
  const { focused, items } = state;
  return {
    focused,
    fields: getItemFields(state),
    item: items[focused],
  };
};

const actionCreators = {
  updateItem,
};

export default connect(mapStateToProps, actionCreators)(Item);
