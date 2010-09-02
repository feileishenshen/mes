package com.qcadoo.mes.core.data.internal.types;

import org.apache.commons.lang.StringUtils;

import com.qcadoo.mes.core.data.definition.FieldDefinition;
import com.qcadoo.mes.core.data.types.FieldType;
import com.qcadoo.mes.core.data.types.FieldTypeFactory;
import com.qcadoo.mes.core.data.validation.ValidationResults;

public final class StringFieldType implements FieldType {

    private final int lenght;

    public StringFieldType(final int lenght) {
        this.lenght = lenght;
    }

    @Override
    public boolean isSearchable() {
        return true;
    }

    @Override
    public boolean isOrderable() {
        return true;
    }

    @Override
    public boolean isAggregable() {
        return false;
    }

    @Override
    public int getNumericType() {
        if (lenght == 255) {
            return FieldTypeFactory.NUMERIC_TYPE_STRING;
        } else {
            return FieldTypeFactory.NUMERIC_TYPE_TEXT;
        }
    }

    @Override
    public Class<?> getType() {
        return String.class;
    }

    @Override
    public Object fromString(final FieldDefinition fieldDefinition, final String value, final ValidationResults validationResults) {
        return value;
    }

    @Override
    public String toString(final Object value) {
        return String.valueOf(value);
    }

    @Override
    public boolean validate(final FieldDefinition fieldDefinition, final Object value, final ValidationResults validationResults) {
        if (StringUtils.length((String) value) > lenght) {
            validationResults.addError(fieldDefinition, "form.validate.errors.stringIsTooLong", String.valueOf(lenght));
            return false;
        }
        return true;
    }

}
