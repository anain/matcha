import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Wrapper from '../../Wrapper'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

  const Order = ({ currentOrder, sort}) => {
    return (
        <form className={`flex fullWidth row center alignCenter`} autoComplete="off" style={{margin: 0, padding: '10px'}}>
          <FormControl>
            <div className={`flex fullWidth row center alignCenter`}>
              <div style={{fontSize: '18px', padding: '0px 10px', color: 'grey'}}>Trier par</div>
              <Select
                value={currentOrder}
                onChange={sort}
              >
                <MenuItem value={1}>Les plus proches en distance</MenuItem>
                <MenuItem value={2}>Les plus proches en âge</MenuItem>
                <MenuItem value={3}>Les plus proches en tags</MenuItem>
                <MenuItem value={4}>Les plus mûrs</MenuItem>
                <MenuItem value={5}>Les plus jeunes </MenuItem>
                <MenuItem value={6}>Les plus populaires</MenuItem>
              </Select>
            </div>
          </FormControl>
        </form>
        )      
    }


export default Wrapper(styles)()(Order)