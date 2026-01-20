import { Breadcrumb, BreadcrumbProps, Typography } from 'antd';
import { Link } from 'react-router';

const itemRender: BreadcrumbProps['itemRender'] = (
  currentRoute,
  params,
  items,
  paths,
) => {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return (
    <Typography.Title level={4} style={{ margin: 0 }}>
      {isLast ? (
        <span>{currentRoute.title}</span>
      ) : (
        <Link to={`/${paths.join('/')}`}>{currentRoute.title}</Link>
      )}
    </Typography.Title>
  );
};

export type BreadcrumbsProps = BreadcrumbProps;

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  return (
    <Breadcrumb
      {...props}
      itemRender={itemRender}
      style={{ alignItems: 'center' }}
    />
  );
};
