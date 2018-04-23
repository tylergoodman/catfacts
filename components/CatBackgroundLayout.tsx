import 'isomorphic-fetch';
import React from 'react';
import cs from 'classnames';


const CatBackgroundLayout: React.SFC<React.HTMLAttributes<{}>> = ({ children, ...rest }) =>
  <div className={cs(rest.className, 'main')}>
    <div className='bg' />
    {children}
  </div>
  ;

export default CatBackgroundLayout;
