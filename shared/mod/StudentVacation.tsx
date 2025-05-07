import { Modal, Input, Form } from "antd";
import { useVacationCreateStudentMutation } from "@/hooks/mutation";

type VacationModalProps = {
  open: boolean;
  onClose: () => void;
  studentId: string | null;
};

const StudentVacation: React.FC<VacationModalProps> = ({
  open,
  onClose,
  studentId,
}) => {
  const [form] = Form.useForm();
  const { mutate: createVacation, isPending } =
    useVacationCreateStudentMutation();

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (!studentId) return;
      createVacation(
        {
          student_id: studentId,
          leave_days: values.leave_days,
          reason: values.reason,
        },
        {
          onSuccess: () => {
            form.resetFields();
            onClose();
          },
        }
      );
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Ta'tilga chiqarish"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Yuborish"
      cancelText="Bekor qilish"
      okButtonProps={{ loading: isPending }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Ta'til kunlari soni"
          name="leave_days"
          rules={[
            { required: true, message: "Iltimos, kunlar sonini kiriting" },
          ]}
        >
          <Input type="number" placeholder="Masalan: 4" />
        </Form.Item>
        <Form.Item
          label="Sababi"
          name="reason"
          rules={[{ required: true, message: "Iltimos, sababi kiriting" }]}
        >
          <Input.TextArea rows={4} placeholder="Masalan: Tobi yo'q" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentVacation;
