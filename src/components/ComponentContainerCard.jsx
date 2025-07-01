import clsx from 'clsx';
import Link from 'next/link';
import { Card, CardBody, CardTitle } from 'react-bootstrap';
const ComponentContainerCard = ({
  title,
  id,
  description,
  children,
  titleClass,
  descriptionClass,
  className
}) => {
  return <Card className={clsx('bg-dark text-light', className)}>
      <CardBody className="bg-dark text-light">
        <CardTitle as={'h5'} className={clsx('anchor mb-1', titleClass)} id={id}>
          {title}
          <Link className="anchor-link" href={`#${id}`}>
            #
          </Link>
        </CardTitle>
        {!!description && <p className={clsx('text-muted', descriptionClass)}>{description}</p>}
        <>{children}</>
      </CardBody>
    </Card>;
};
export default ComponentContainerCard;