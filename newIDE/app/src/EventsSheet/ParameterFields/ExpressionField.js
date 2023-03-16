// @flow
import * as React from 'react';
import GenericExpressionField from './GenericExpressionField';
import {
  type ParameterFieldProps,
  type ParameterFieldInterface,
} from './ParameterFieldCommons';

export default React.forwardRef<ParameterFieldProps, ParameterFieldInterface>(
  function EpressionField(props: ParameterFieldProps, ref) {
    const field = React.useRef<?GenericExpressionField>(null);
    React.useImperativeHandle(ref, () => ({
      focus: ({ selectAll = false }: { selectAll?: boolean }) => {
        if (field.current) field.current.focus({ selectAll });
      },
    }));

    return (
      <GenericExpressionField
        expressionType="number"
        ref={field}
        id={
          props.parameterIndex !== undefined
            ? `parameter-${props.parameterIndex}-expression-field`
            : undefined
        }
        {...props}
      />
    );
  }
);
