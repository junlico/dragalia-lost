import React, { createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateItem } from 'actions';
import { getItemFields, getLimit, useEvent } from 'utils';
import { Input } from 'components';
import SelectItem from './SelectItem';

const fieldRef = {
  level: createRef(),
  augHp: createRef(),
  augStr: createRef(),
};

function Item({ focused, fields, item, updateItem }) {
  const { level, curRarity, rarity, unbind } = item || {};

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

        fieldRef.level.current.setValue(level);
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
        fieldRef.level.current.setValue(level);
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

  const onClick = e => {
    const { name } = e.target;
    const max = getLimit(name);
    fieldRef[name].current.setValue(max);
  };

  useEffect(() => {
    if (level === '') {
      fieldRef.level.current.setValue(1);
      updateItem({ itemKey: focused, updates: { level: 1 } });
    }
  }, [level, focused, updateItem]);

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

        const newKey = key === 'level' ? focused : key;
        const newRarity = focused === 'adventurer' ? curRarity : rarity;
        const max = getLimit(newKey, newRarity, unbind);
        return (
          <div key={key}>
            {key}
            <div className="flex">
              <Input
                ref={fieldRef[key]}
                value={value}
                name={key}
                max={max}
                onChange={handleChange}
              />
              {(key === 'augHp' || key === 'augStr') && (
                <button
                  type="button"
                  className="input-btn"
                  name={key}
                  onClick={onClick}
                >
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
