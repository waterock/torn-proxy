import React, { FC, useContext } from 'react';
import Modal from '../Modal';
import Key from '../../../interfaces/Key';
import AppContext from '../../AppContext';
import useConversion from '../../hooks/useConversion';

interface Props {
  keyEntity: Key
  onKeyUpdated(key: Key): any
  onClose(): any
}

const PermissionsModal: FC<Props> = ({ keyEntity: key, onKeyUpdated, onClose }) => {
  const app = useContext(AppContext);
  const conversion = useConversion();

  async function toggleAllowEverything(namespace: 'torn' | 'tornstats', allow: boolean) {
    if (namespace === 'tornstats') {
      // todo
      return;
    }

    key.permissions.torn = allow ? true : {
      user: true,
      property: true,
      faction: true,
      company: true,
      market: true,
      education: true,
    };

    const requestBody = {
      permissions: key.permissions,
    };

    //setSaving(true);
    const response = await fetch(`${app.serverBaseUrl}/api/keys/${key.key}`, {
      method: 'put',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const updatedKey = await response.json();
    onKeyUpdated(conversion.convertKeyRecordToEntity(updatedKey));
  }

  return (
    <Modal title={`Permissions for "${key.description}"`} onClose={onClose}>

      <h3>Torn</h3>
      <label>
        <input type="checkbox" checked={key.permissions.torn === true} onChange={(event) => toggleAllowEverything('torn', event.target.checked)} />
        Allow everything
      </label>

      {key.permissions.torn !== true && (
        <>
          <h4>User</h4>
            <label><input type="radio" name="endpoint" value="true"/> allow</label>
            <label><input type="radio" name="endpoint" value="false"/> deny</label>
            <label><input type="radio" name="endpoint" value=""/> specify...</label>
          <h4>Market</h4>
        </>
      )}

      {/*<h3>Tornstats</h3>*/}
    </Modal>
  )
}

export default PermissionsModal;
