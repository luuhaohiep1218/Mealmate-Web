import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";

const { TextArea } = Input;

const EditRecipeModal = ({ visible, onCancel, onSuccess, recipe }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      form.setFieldsValue({
        title: recipe.name,
        description: recipe.description,
        imageUrl: recipe.image,
        ingredients: recipe.ingredients?.map((ing) => ({
          id: Date.now() + Math.random(),
          name: ing.name,
          quantity: ing.quantity,
        })) || [{ id: Date.now(), name: "", quantity: "" }],
        steps: recipe.steps?.map((step, index) => ({
          id: Date.now() + index,
          content: step,
        })) || [{ id: Date.now(), content: "" }],
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        servings: recipe.servings,
        calories: recipe.calories,
        tags: recipe.tags?.map((tag) => ({
          id: Date.now() + Math.random(),
          tag: tag,
        })) || [{ id: Date.now(), tag: "" }],
      });
    }
  }, [recipe, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = {
        name: values.title,
        description: values.description,
        image: values.imageUrl ? values.imageUrl.trim() : null,
        prep_time: parseInt(values.prepTime || 0),
        cook_time: parseInt(values.cookTime || 0),
        total_time:
          parseInt(values.prepTime || 0) + parseInt(values.cookTime || 0),
        servings: parseInt(values.servings),
        ingredients: values.ingredients
          .map((ing) => ({
            name: ing.name.trim(),
            quantity: ing.quantity.trim(),
          }))
          .filter((ing) => ing.name !== "" && ing.quantity !== ""),
        steps: values.steps
          .map((step) => step.content.trim())
          .filter((step) => step !== ""),
        calories: parseInt(values.calories || 0),
        tags: values.tags.map((t) => t.tag.trim()).filter((tag) => tag !== ""),
      };

      await api.put(endpoints.recipes.update(recipe._id), formData);
      message.success("Cập nhật công thức thành công!");
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi cập nhật công thức:", error);
      message.error("Không thể cập nhật công thức. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh Sửa Công Thức"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Tên Công Thức"
          rules={[{ required: true, message: "Vui lòng nhập tên công thức" }]}
        >
          <Input placeholder="Nhập tên công thức" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả công thức" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả công thức" />
        </Form.Item>

        <Form.List
          name="ingredients"
          rules={[
            {
              validator: async (_, ingredients) => {
                if (
                  !ingredients ||
                  ingredients.filter(
                    (ing) =>
                      ing.name.trim() !== "" && ing.quantity.trim() !== ""
                  ).length < 1
                ) {
                  return Promise.reject(
                    new Error("Cần ít nhất một nguyên liệu")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Nguyên Liệu:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập tên nguyên liệu",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Tên nguyên liệu"
                        style={{ width: "200px" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "quantity"]}
                      fieldKey={[field.fieldKey, "quantity"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập số lượng",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Số lượng"
                        style={{ width: "150px" }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({ id: Date.now(), name: "", quantity: "" })
                  }
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Nguyên Liệu
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.List
          name="steps"
          rules={[
            {
              validator: async (_, steps) => {
                if (
                  !steps ||
                  steps.filter((step) => step.content.trim() !== "").length < 1
                ) {
                  return Promise.reject(
                    new Error("Cần ít nhất một bước thực hiện")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Các Bước Thực Hiện:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "content"]}
                      fieldKey={[field.fieldKey, "content"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Vui lòng nhập nội dung bước thực hiện hoặc xóa trường này.",
                        },
                      ]}
                      noStyle
                    >
                      <Input.TextArea
                        placeholder={`Bước ${index + 1}`}
                        style={{ width: "500px" }}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: Date.now(), content: "" })}
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Bước
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.Item
          name="prepTime"
          label="Thời Gian Chuẩn Bị (phút)"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian chuẩn bị" },
          ]}
        >
          <Input type="number" placeholder="Nhập thời gian chuẩn bị (phút)" />
        </Form.Item>

        <Form.Item
          name="cookTime"
          label="Thời Gian Nấu (phút)"
          rules={[{ required: true, message: "Vui lòng nhập thời gian nấu" }]}
        >
          <Input type="number" placeholder="Nhập thời gian nấu (phút)" />
        </Form.Item>

        <Form.Item
          name="servings"
          label="Khẩu Phần"
          rules={[{ required: true, message: "Vui lòng nhập số khẩu phần" }]}
        >
          <Input type="number" placeholder="Nhập số khẩu phần" />
        </Form.Item>

        <Form.Item
          name="calories"
          label="Calories"
          rules={[{ required: true, message: "Vui lòng nhập số calories" }]}
        >
          <Input type="number" placeholder="Nhập số calories" />
        </Form.Item>

        <Form.List
          name="tags"
          rules={[
            {
              validator: async (_, tags) => {
                if (
                  !tags ||
                  tags.filter((tag) => tag.tag.trim() !== "").length < 1
                ) {
                  return Promise.reject(new Error("Cần ít nhất một thẻ tag"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginBottom: 8, display: "block" }}>
                  Thẻ Tag:
                </label>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "tag"]}
                      fieldKey={[field.fieldKey, "tag"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập thẻ tag hoặc xóa trường này.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Nhập thẻ tag"
                        style={{ width: "200px" }}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: Date.now(), tag: "" })}
                  icon={<PlusOutlined />}
                  style={{ width: "200px" }}
                >
                  Thêm Tag
                </Button>
                <Form.ErrorList errors={errors} />
              </div>
            </>
          )}
        </Form.List>

        <Form.Item
          name="imageUrl"
          label="Link Hình Ảnh"
          rules={[
            {
              type: "url",
              message: "Vui lòng nhập đúng định dạng URL",
            },
          ]}
        >
          <Input placeholder="Nhập link hình ảnh của công thức" />
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button style={{ marginRight: 8 }} onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập Nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRecipeModal;
