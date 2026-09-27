const FavoritesToggle = ({ checked, count, onChange }) => {
  return (
    <div className='controls'>
      <label htmlFor='favorites-only'>
        <input
          type='checkbox'
          id='favorites-only'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />{' '}
        ★ Favorites only ({count})
      </label>
    </div>
  );
};

export default FavoritesToggle;
