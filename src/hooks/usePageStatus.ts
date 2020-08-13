import * as React from 'react';
import Incorrect from 'classes/Incorrect';
import { errorCode } from 'configs/enumerations';

export default function usePageStatus (loadingText?: string) {
  const [status, setStatus] = React.useState<Incorrect | null>(new Incorrect(errorCode.loading.code, loadingText));

  return { status, setStatus };
}
